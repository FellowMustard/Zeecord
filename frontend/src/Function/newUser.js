const SetNewUser = (value) => {
  localStorage.setItem("new-user", value);
};

const GetNewUser = () => {
  return localStorage.getItem("new-user");
};

export { SetNewUser, GetNewUser };
