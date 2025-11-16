import { UserService } from '../services/user.service.js';

export const UserController = {
  
  async getAll(req, res, next) {
    try {
      const data = await UserService.getAll(req.query);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id, req.user);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.params.id, req.body, req.user);
      res.json({ success: true, message: "Profile updated successfully", data: updatedUser });
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const result = await UserService.deleteUser(req.params.id, req.user);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
};
