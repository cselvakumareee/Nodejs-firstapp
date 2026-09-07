import { User } from "../models/user";

export const getLogin = (req: any, res: any, next: any) => {
  const isLoggedIn = req.get("Cookie")?.includes("loggedIn=true");
  console.log("isLoggedIn:", isLoggedIn);
  console.log("session", req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

export const postLogin = async (req: any, res: any, next: any) => {
  try {
    const user = await User.findById("6a999760addb306d50bc7f53").exec();

    if (!user) {
      return res.redirect("/login");
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
      // name: user?.name,
      email: user.email,
    };

    req.session.save((err: any) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
};

export const postLogout = (req: any, res: any, next: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export const getSignup = (req: any, res: any, next: any) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

export const postSignup = async (req: any, res: any, next: any) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  await User.findOne({ email: email })
    .exec()
    .then((userDoc: any) => {
      console.log("userDoc:", userDoc);
      if (userDoc) {
        return res.redirect("/signup");
      }
      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result: any) => {
      res.redirect("/login");
    })
    .catch((err: any) => {
      console.error("Error during signup:", err);
      next(err);
    });
};
