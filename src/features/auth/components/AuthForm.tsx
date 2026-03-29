const AuthForm = () => {
  return (
    <div>
      <div className="flex flex-col">
        <span className="font-semibold text-[32px] text-[#333333]">
          Set up your admin account
        </span>
        <span className="font-normal text-[16px]">
          Fill in your information to create your account
        </span>
      </div>
      <form action="" className="flex flex-col">
        <label htmlFor="username">User Name</label>
        <input name="username" id="username" placeholder="User Name" />
        <label htmlFor="email">Email Address</label>
        <input name="email" id="email" placeholder="Email Address" />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter Passowrd"
        />
      </form>
    </div>
  );
};

export default AuthForm;
