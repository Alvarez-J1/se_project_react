import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import ItemModal from "../ItemModal/ItemModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import {
  APIkey,
  coordinates,
  defaultClothingItems,
} from "../../utils/constants";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import { getItems, deleteItem } from "../../utils/api";
import * as auth from "../../utils/auth";
import * as api from "../../utils/api";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
  });
  const [clothingItems, setClothingItems] = useState(defaultClothingItems);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    email: "",
    name: "",
    avatar: "",
  });
  const [token, setToken] = useState(localStorage.getItem("jwt") || "");
  const navigate = useNavigate();

  const handleRegistration = ({ email, password, name, avatar }) => {
    return auth
      .signUp({ email, password, name, avatar })
      .then(() => {
        return auth.logIn({ email, password });
      })
      .then((data) => {
        if (!data?.token) return;
        return auth.checkToken(data.token).then((user) => {
          localStorage.setItem("jwt", data.token);
          setToken(data.token);
          setCurrentUser(user);
          setIsLoggedIn(true);
          closeRegisterModal();
          navigate("/");
          return data;
        });
      })
      .catch((err) => {
        localStorage.removeItem("jwt");
        setToken("");
        setCurrentUser({ email: "", name: "", avatar: "" });
        setIsLoggedIn(false);
        console.error("Registration error:", err);
        throw err;
      });
  };

  const handleLogin = ({ email, password }) => {
    return auth
      .logIn({ email, password })
      .then((data) => {
        if (data.token) {
          return auth
            .checkToken(data.token)
            .then((user) => {
              localStorage.setItem("jwt", data.token);
              setToken(data.token);
              setCurrentUser(user);
              setIsLoggedIn(true);
              closeLoginModal();
              navigate("/");
              return data;
            })
            .catch((err) => {
              localStorage.removeItem("jwt");
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
    auth
      .editProfile({ name, avatar }, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeEditProfileModal();
      })
      .catch((err) => {
        console.error("Update failed", err);
      });
  };

  const handleCardLike = (item) => {
    const token = localStorage.getItem("jwt");
    const id = item._id;
    const isLiked = item.likes?.some((uid) => uid === currentUser._id);
    const action = isLiked
      ? api.removeCardLike(id, token)
      : api.addCardLike(id, token);

    action
      .then((updatedCard) => {
        setClothingItems((cards) =>
          cards.map((c) => (c._id === id ? updatedCard : c))
        );
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setToken("");
    setIsLoggedIn(false);
    setCurrentUser({ email: "", name: "", avatar: "" });
  };

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "F") {
      setCurrentTemperatureUnit("C");
    } else setCurrentTemperatureUnit("F");
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

  const closeRegisterModal = () => {
    setActiveModal("");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const closeLoginModal = () => {
    setActiveModal("");
  };

  const closeEditProfileModal = () => {
    setActiveModal("");
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    api
      .addItem({ name, imageUrl, weather, token })
      .then((newItem) => {
        setClothingItems([newItem, ...clothingItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteItemModalSubmit = (cardId) => {
    deleteItem(cardId, token)
      .then(() => {
        setClothingItems(clothingItems.filter((item) => item._id !== cardId));
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        console.log("API Data:", data);
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((user) => {
          setToken(jwt);
          setCurrentUser(user);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          console.error("Token invalid or expired", err);
          localStorage.removeItem("jwt");
          setToken("");
          setCurrentUser({ email: "", name: "", avatar: "" });
          setIsLoggedIn(false);
        });
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
              onLoginClick={openLoginModal}
              onRegisterClick={openRegisterModal}
            />
            <Routes>
              {" "}
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    onCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      handleAddClick={handleAddClick}
                      onEditProfileClick={openEditProfileModal}
                      onCardLike={handleCardLike}
                      onLogout={handleLogout}
                    />
                  </ProtectedRoute>
                }
              />{" "}
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
            onClose={closeRegisterModal}
            onRegister={handleRegistration}
          />
          <LoginModal
            isOpen={activeModal === "login"}
            onClose={closeLoginModal}
            onLogin={handleLogin}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeEditProfileModal}
            onEditProfile={handleEditProfile}
            currentUser={currentUser}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
