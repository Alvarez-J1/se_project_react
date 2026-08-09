// React imports
import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";

// Components
import "./App.css";
import AddItemModal from "../AddItemModal/AddItemModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import ItemModal from "../ItemModal/ItemModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

// Utils
import {
  DEMO_SESSION_STORAGE_KEY,
  defaultClothingItems,
  demoClothingItems,
  demoUser,
  LOCAL_ITEM_LIKES_STORAGE_KEY,
} from "../../utils/constants";
import { deleteItem } from "../../utils/api";
import * as auth from "../../utils/auth";
import * as api from "../../utils/api";

// Hooks
import useWeather from "../../hooks/useWeather";

// Contexts
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const THEME_STORAGE_KEY = "weatherfit-theme";
const JWT_STORAGE_KEY = "jwt";

const getStoredTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return null;
};

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const isApiItemId = (id) => /^[a-f\d]{24}$/i.test(String(id));

const normalizeId = (id) => String(id);

const isItemLikedByUser = (item, userId) => {
  const likes = Array.isArray(item.likes) ? item.likes : [];
  return likes.some((id) => normalizeId(id) === userId);
};

const toggleItemLike = (item, userId) => {
  const likes = Array.isArray(item.likes) ? item.likes : [];
  const isLiked = isItemLikedByUser(item, userId);

  return {
    ...item,
    likes: isLiked
      ? likes.filter((id) => normalizeId(id) !== userId)
      : [...likes, userId],
  };
};

const cloneClothingItems = (items) =>
  items.map((item) => ({
    ...item,
    likes: Array.isArray(item.likes) ? [...item.likes] : [],
  }));

const getStoredLocalItemLikes = () => {
  try {
    const storedLikes = localStorage.getItem(LOCAL_ITEM_LIKES_STORAGE_KEY);

    if (!storedLikes) return {};

    const parsedLikes = JSON.parse(storedLikes);

    if (!parsedLikes || typeof parsedLikes !== "object") {
      return {};
    }

    return parsedLikes;
  } catch {
    return {};
  }
};

const saveStoredLocalItemLikes = (likesByItemId) => {
  if (Object.keys(likesByItemId).length === 0) {
    localStorage.removeItem(LOCAL_ITEM_LIKES_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    LOCAL_ITEM_LIKES_STORAGE_KEY,
    JSON.stringify(likesByItemId),
  );
};

const mergeStoredLocalLikes = (items) => {
  const likesByItemId = getStoredLocalItemLikes();

  return cloneClothingItems(items).map((item) => {
    const storedLikes = likesByItemId[normalizeId(item._id)];

    if (!Array.isArray(storedLikes)) {
      return item;
    }

    return {
      ...item,
      likes: storedLikes.map(normalizeId),
    };
  });
};

const persistLocalItemLikes = (item) => {
  const likesByItemId = getStoredLocalItemLikes();
  const itemId = normalizeId(item._id);
  const likes = Array.isArray(item.likes) ? item.likes.map(normalizeId) : [];

  likesByItemId[itemId] = likes;

  saveStoredLocalItemLikes(likesByItemId);
};

const removeStoredLocalItemLikes = (itemId) => {
  const likesByItemId = getStoredLocalItemLikes();
  delete likesByItemId[normalizeId(itemId)];
  saveStoredLocalItemLikes(likesByItemId);
};

function App() {
  const {
    weatherData,
    isLoading: isWeatherLoading,
    error: weatherError,
    locationStatus,
    requestLocation,
  } = useWeather();
  const [clothingItems, setClothingItems] = useState(() =>
    mergeStoredLocalLikes(defaultClothingItems),
  );
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [theme, setTheme] = useState(getPreferredTheme);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(
    localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === "true",
  );
  const [currentUser, setCurrentUser] = useState({
    email: "",
    name: "",
    avatar: "",
  });
  const [token, setToken] = useState(
    localStorage.getItem(JWT_STORAGE_KEY) || "",
  );
  const navigate = useNavigate();

  const clearDemoSession = () => {
    localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    setIsDemoMode(false);
  };

  const handleRegistration = ({ email, password, name, avatar }) => {
    clearDemoSession();
    return auth
      .signUp({ email, password, name, avatar })
      .then(() => {
        return auth.logIn({ email, password });
      })
      .then((data) => {
        if (!data?.token) return;
        return auth.checkToken(data.token).then((user) => {
          localStorage.setItem(JWT_STORAGE_KEY, data.token);
          setToken(data.token);
          setCurrentUser(user);
          setClothingItems(mergeStoredLocalLikes(defaultClothingItems));
          setIsLoggedIn(true);
          closeActiveModal();
          navigate("/");
          return data;
        });
      })
      .catch((err) => {
        localStorage.removeItem(JWT_STORAGE_KEY);
        setToken("");
        setCurrentUser({ email: "", name: "", avatar: "" });
        setIsLoggedIn(false);
        console.error("Registration error:", err);
        throw err;
      });
  };

  const handleLogin = ({ email, password }) => {
    clearDemoSession();
    return auth
      .logIn({ email, password })
      .then((data) => {
        if (data.token) {
          return auth
            .checkToken(data.token)
            .then((user) => {
              localStorage.setItem(JWT_STORAGE_KEY, data.token);
              setToken(data.token);
              setCurrentUser(user);
              setClothingItems(mergeStoredLocalLikes(defaultClothingItems));
              setIsLoggedIn(true);
              closeActiveModal();
              navigate("/");
              return data;
            })
            .catch((err) => {
              localStorage.removeItem(JWT_STORAGE_KEY);
              setToken("");
              setCurrentUser({ email: "", name: "", avatar: "" });
              setIsLoggedIn(false);
              console.error("Token validation failed", err);
              throw err;
            });
        }
      })
      .catch((err) => {
        const status =
          err?.status ?? err?.response?.status ?? Number(err?.message);

        if (status === 401) {
          const e = new Error("INVALID_CREDENTIALS");
          e.code = "INVALID_CREDENTIALS";
          throw e;
        }
        throw err;
      });
  };

  const handleEditProfile = ({ name, avatar }) => {
    if (isDemoMode) {
      setCurrentUser((user) => ({
        ...user,
        name: name.trim(),
        avatar: avatar.trim(),
      }));
      closeActiveModal();
      return;
    }

    auth
      .editProfile({ name, avatar }, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeActiveModal();
      })
      .catch((err) => {
        console.error("Update failed", err);
      });
  };

  const handleCardLike = (item) => {
    const userId = currentUser?._id;
    const id = item._id;

    if (!userId) return;

    const isLiked = isItemLikedByUser(item, userId);

    if (isDemoMode || !isApiItemId(id)) {
      setClothingItems((cards) => {
        const updatedCards = cards.map((card) =>
          normalizeId(card._id) === normalizeId(id)
            ? toggleItemLike(card, userId)
            : card,
        );
        const updatedCard = updatedCards.find(
          (card) => normalizeId(card._id) === normalizeId(id),
        );

        if (updatedCard) {
          persistLocalItemLikes(updatedCard);
        }

        return updatedCards;
      });
      return;
    }

    const jwt = token || localStorage.getItem(JWT_STORAGE_KEY);

    if (!jwt) return;

    const action = isLiked
      ? api.removeCardLike(id, jwt)
      : api.addCardLike(id, jwt);

    action
      .then((updatedCard) => {
        setClothingItems((cards) =>
          cards.map((card) =>
            normalizeId(card._id) === normalizeId(id) ? updatedCard : card,
          ),
        );
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    setToken("");
    setIsDemoMode(false);
    setIsLoggedIn(false);
    setCurrentUser({ email: "", name: "", avatar: "" });
    setClothingItems(mergeStoredLocalLikes(defaultClothingItems));
    navigate("/");
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit((unit) => (unit === "F" ? "C" : "F"));
  };

  const handleToggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      return nextTheme;
    });
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const openRegisterModal = () => {
    setActiveModal("register");
  };

  const openLoginModal = () => {
    setActiveModal("login");
  };

  const openEditProfileModal = () => {
    setActiveModal("edit-profile");
  };

  const handleDemoLogin = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.setItem(DEMO_SESSION_STORAGE_KEY, "true");
    setToken("");
    setIsDemoMode(true);
    setIsAuthChecking(false);
    setCurrentUser(demoUser);
    setClothingItems(mergeStoredLocalLikes(demoClothingItems));
    setIsLoggedIn(true);
    closeActiveModal();
    navigate("/profile");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  useEffect(() => {
    if (!activeModal) return undefined;

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        closeActiveModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeModal]);

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    if (isDemoMode) {
      const newItem = {
        _id: `demo-${Date.now()}`,
        name,
        imageUrl,
        weather,
        owner: demoUser._id,
        likes: [],
      };

      setClothingItems((items) => [newItem, ...items]);
      closeActiveModal();
      return;
    }

    api
      .addItem({ name, imageUrl, weather, token })
      .then((newItem) => {
        setClothingItems([newItem, ...clothingItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteItemModalSubmit = (cardId) => {
    if (isDemoMode || !isApiItemId(cardId)) {
      removeStoredLocalItemLikes(cardId);
      setClothingItems((items) => items.filter((item) => item._id !== cardId));
      closeActiveModal();
      return;
    }

    deleteItem(cardId, token)
      .then(() => {
        setClothingItems(clothingItems.filter((item) => item._id !== cardId));
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!activeModal) return undefined;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.paddingRight = bodyPaddingRight;
    };
  }, [activeModal]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (event) => {
      if (!getStoredTheme()) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    setIsAuthChecking(true);
    const jwt = localStorage.getItem(JWT_STORAGE_KEY);
    const hasDemoSession =
      localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === "true";

    if (hasDemoSession) {
      localStorage.removeItem(JWT_STORAGE_KEY);
      setToken("");
      setCurrentUser(demoUser);
      setClothingItems(mergeStoredLocalLikes(demoClothingItems));
      setIsLoggedIn(true);
      setIsDemoMode(true);
      setIsAuthChecking(false);
      return;
    }

    if (!jwt) {
      setIsLoggedIn(false);
      setIsDemoMode(false);
      setIsAuthChecking(false);
      return;
    }

    auth
      .checkToken(jwt)
      .then((user) => {
        setToken(jwt);
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error("Token invalid or expired", err);
        localStorage.removeItem(JWT_STORAGE_KEY);
        setToken("");
        setCurrentUser({ email: "", name: "", avatar: "" });
        setClothingItems(mergeStoredLocalLikes(defaultClothingItems));
        setIsLoggedIn(false);
      })
      .finally(() => setIsAuthChecking(false));
  }, []);

  const pageWeatherClass = `page page_weather_${weatherData.type || "default"}`;

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className={pageWeatherClass}>
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              onLoginClick={openLoginModal}
              onRegisterClick={openRegisterModal}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                    isWeatherLoading={isWeatherLoading}
                    weatherError={weatherError}
                    locationStatus={locationStatus}
                    onUseMyLocation={requestLocation}
                  />
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute
                    isLoggedIn={isLoggedIn}
                    isAuthChecking={isAuthChecking}
                    fallback={
                      <div className="app__loader" role="status">
                        Checking session...
                      </div>
                    }
                  >
                    <Profile
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      onEditProfileClick={openEditProfileModal}
                      onCardLike={handleCardLike}
                      onLogout={handleLogout}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Footer />
          </div>
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItemModalSubmit={handleAddItemModalSubmit}
          />
          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            onClose={closeActiveModal}
            onDeleteItem={handleDeleteItemModalSubmit}
            onCardLike={handleCardLike}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onClose={closeActiveModal}
            onRegister={handleRegistration}
            onOpenLogin={openLoginModal}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onClose={closeActiveModal}
            onLogin={handleLogin}
            onOpenRegister={openRegisterModal}
            onViewDemo={handleDemoLogin}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeActiveModal}
            onEditProfile={handleEditProfile}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
