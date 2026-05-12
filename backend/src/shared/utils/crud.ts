import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "./async-handler";
import { sendSuccess } from "./api-response";
import { HttpError } from "./http-error";
import { validate } from "../../middlewares/validate.middleware";
import { messages } from "../constants/messages";

type Delegate = {
  findMany(args?: unknown): Promise<unknown>;
  findUnique(args: unknown): Promise<unknown>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
};

export type CrudConfig = {
  delegate: Delegate;
  idField: string;
  include?: Record<string, unknown>;
};

const idParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export function createRepository({ delegate, idField, include }: CrudConfig) {
  const withInclude = include ? { include } : {};

  return {
    findAll: () => delegate.findMany({ ...withInclude }),
    findById: (id: number) => delegate.findUnique({ where: { [idField]: id }, ...withInclude }),
    create: (data: unknown) => delegate.create({ data, ...withInclude }),
    update: (id: number, data: unknown) => delegate.update({ where: { [idField]: id }, data, ...withInclude }),
    delete: (id: number) => delegate.delete({ where: { [idField]: id } }),
  };
}

export function createService(repository: ReturnType<typeof createRepository>) {
  return {
    async findAll() {
      return repository.findAll();
    },
    async findById(id: number) {
      const record = await repository.findById(id);
      if (!record) throw new HttpError(404, messages.notFound);
      return record;
    },
    async create(data: unknown) {
      return repository.create(data);
    },
    async update(id: number, data: unknown) {
      await this.findById(id);
      return repository.update(id, data);
    },
    async delete(id: number) {
      await this.findById(id);
      await repository.delete(id);
      return null;
    },
  };
}

export function createController(service: ReturnType<typeof createService>) {
  return {
    findAll: asyncHandler(async (_req, res) => sendSuccess(res, messages.listed, await service.findAll())),
    findById: asyncHandler(async (req, res) => sendSuccess(res, messages.found, await service.findById(Number(req.params.id)))),
    create: asyncHandler(async (req, res) => sendSuccess(res, messages.created, await service.create(req.body), 201)),
    update: asyncHandler(async (req, res) => sendSuccess(res, messages.updated, await service.update(Number(req.params.id), req.body))),
    delete: asyncHandler(async (req, res) => sendSuccess(res, messages.deleted, await service.delete(Number(req.params.id)))),
  };
}

export function createCrudRoutes(controller: ReturnType<typeof createController>, createSchema: z.AnyZodObject, updateSchema: z.AnyZodObject) {
  const router = Router();
  router.get("/", controller.findAll);
  router.get("/:id", validate(idParamsSchema), controller.findById);
  router.post("/", validate(createSchema), controller.create);
  router.put("/:id", validate(idParamsSchema.merge(updateSchema)), controller.update);
  router.delete("/:id", validate(idParamsSchema), controller.delete);
  return router;
}
