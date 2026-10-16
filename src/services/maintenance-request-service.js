const repository = require('../repositories/maintenance-request-repository');

async function list(pagination) { return repository.list(pagination); }
async function getById(id) { return repository.getById(id); }
async function create(data) { return repository.create(data); }
async function update(id, data) { return repository.update(id, data); }
async function remove(id) { return repository.remove(id); }

module.exports = { list, getById, create, update, remove };
