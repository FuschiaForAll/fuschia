import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { UserModel } from "../Models";
import { Context, FieldError } from "../types";
import { User } from "./User.entity";
import { UserRole, UserStatus } from "./User.enum";
import { UserInput } from "./User.input";
import { hash, verify } from "argon2";
import { ApolloError } from "apollo-server";
import { COOKIE_NAME } from "../consts";

const passwordRegex = /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{6,}/g;

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  sessionId?: String;
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context) {
    if (!ctx.req.session.email) { throw new ApolloError("Unauthorized") }
    return UserModel.findOne({ where: { email: ctx.req.session.email } })
  }

  @Mutation(returns => User)
  async createUser(@Arg("user") user: UserInput) {
    const newUser = new UserModel({
      ...User
    })
    newUser.save()
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ) {
    const lowerCaseEmail = email.toLowerCase()
    const hashedPassword = await hash(password);
 
    const checkExists = await UserModel.findOne({ where: { email } })
    if (checkExists) {
      throw new ApolloError("Email account is already in use")
    }

    const createResult = await UserModel.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      userRole: UserRole.USER,
      status: UserStatus.ACTIVE
    }).catch(error => {
      console.log('Users.Resolver::Register() Err', error)
      throw new ApolloError("Failed to register your account")
    })

    if (!createResult || !createResult.id) {
      throw new ApolloError("Unable to register your account at this time")
    }

    ctx.req.session.email = createResult.email;
    ctx.req.session.userRole = createResult.userRole;
    ctx.req.session.userId = createResult._id;

    return { user: createResult }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: Context
  ) {
    const lowerCaseEmail = email.toLowerCase()
    const user = await UserModel.findOne({
      where: { email: lowerCaseEmail }
    });

    if (!user) {
      throw new ApolloError("Login error");
    }
    const valid = await verify(user.password, password);
    if (!valid) {
      throw new ApolloError("Login error");
    }
    ctx.req.session.email = user.email;
    ctx.req.session.userRole = user.userRole;
    ctx.req.session.userId = user._id;

    return { user, sessionId: ctx.req.session.id };
  }
  
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context) {
    return new Promise((resolve) =>
      ctx.req.session.destroy((err) => {
        ctx.res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}