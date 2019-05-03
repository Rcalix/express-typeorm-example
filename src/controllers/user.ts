import {Request, Response} from "express";
import {getManager, Repository} from "typeorm";
import { User } from "../entity/User";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function login(request: Request, response: Response) {
  let fetchedUser: any;
  const UserRepository = getManager().getRepository(User);
  fetchedUser = await UserRepository.findOne({ email: request.body.email })
    .then(user => {
      if (!user) {
        return response.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(request.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return response.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id, role: fetchedUser.role },
        "Rv!&1ZlyYEz#KX10&e!YlPc943%^KYfctn1t3!gPGLLpy#dUaJ!5Od#zRgqfPw7#%",
        { expiresIn: "1h" } //1h to expire
      );
      response.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        role: fetchedUser.role
      });
    })
    .catch(err => {
      return response.status(401).json({
        message: "Auth failed"
      });
    });
}

export async function signup(request: Request, response: Response) {
  const userRepository = getManager().getRepository(User);
    bcrypt.hash(request.body.password, 10).then(async (hash: string) => {
    const user = new User();
    user.email = request.body.email;
    user.role = request.body.role;
    user.password = hash;
    await userRepository.save(user) 
      .then(result => {
        response.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        response.status(500).json({
          error: err
        });
      });
  });
}

export async function getAllUsers(request: Request, response: Response) {
  const userRepository = getManager().getRepository(User);
  const users = await userRepository.find();
  response.send(users);
}

export async function updateUser(request: Request, response: Response) {
  const userRepository = getManager().getRepository(User);
  const user = await userRepository.findOne(request.params.id);
  
  // if user was not found return 404 to the client
  if (!user) {
      response.status(404);
      response.end();
      return;
  }

  user.email = request.body.email || user.email;
  user.role = request.body.role || user.role;

  await userRepository.save(user);

  response.send(user);
}

export async function deleteUser(request: Request, response: Response) {
  const userRepository = getManager().getRepository(User);
  const user = await userRepository.findOne(request.params.id);
  // if user was not found return 404 to the client
  if (!user) {
      response.status(404);
      response.end();
      return;
  }

  await userRepository.remove(user);

  response.send(user);
}


export async function getOneUser(request: Request, response: Response) {
  const userRepository = getManager().getRepository(User);
  const user = await userRepository.findOne(request.params.id);

  // if user was not found return 404 to the client
  if (!user) {
      response.status(404);
      response.end();
      return;
  }
  response.send(user);
}