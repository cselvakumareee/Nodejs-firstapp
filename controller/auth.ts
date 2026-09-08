import { User } from "../models/user";
import bcrypt from "bcryptjs";

export const getLogin = (req: any, res: any, next: any) => {
  const isLoggedIn = req.get("Cookie")?.includes("loggedIn=true");
  console.log("isLoggedIn:", isLoggedIn);
  console.log("session", req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

export const postLogin = async (req: any, res: any, next: any) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email }).exec();
    console.log("user:", user);
    if (!user) {
      return res.status(401).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or password.",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("isMatch:", isMatch);
    if (!isMatch) {
      return res.status(401).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Incorrect password.",
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id.toString(),
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
    errorMessage: req.flash("error"),
  });
};

export const postSignup = async (req: any, res: any, next: any) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  try {
    const userDoc = await User.findOne({ email: email }).exec();
    console.log("userDoc:", userDoc);
    if (userDoc) {
      return res.status(401).render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: "Email already exists. Please choose a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    return res.redirect("/login");
  } catch (err) {
    console.error("Error during signup:", err);
    return next(err);
  }
};
