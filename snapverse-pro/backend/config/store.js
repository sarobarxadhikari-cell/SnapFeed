import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "data.json");

let db = { users: [], messages: [] };
let idCounter = 1;

function load() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    db = data;
    idCounter = data._idCounter || db.users.length + 1;
  } catch { seed(); }
}

function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ ...db, _idCounter: idCounter }, null, 2));
}

function genId() { return (idCounter++).toString(); }

function clone(obj) { return obj ? JSON.parse(JSON.stringify(obj)) : obj; }

function seed() {
  const hash = bcrypt.hashSync("123456", 10);
  db.users.push({ id: "1", name: "Alex", email: "alex@snapfeed.com", password: hash, photo: "", online: false, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() });
  db.users.push({ id: "2", name: "Sam", email: "sam@snapfeed.com", password: hash, photo: "", online: false, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() });
  db.users.push({ id: "3", name: "Jordan", email: "jordan@snapfeed.com", password: hash, photo: "", online: false, lastSeen: new Date().toISOString(), createdAt: new Date().toISOString() });
  idCounter = 4;
  save();
}

function filterList(arr, query) {
  if (!query) return [...arr];
  return arr.filter((item) => {
    for (const k in query) {
      if (k === "$or") {
        if (!query.$or.some((cond) => Object.keys(cond).every((ck) => {
          const v = cond[ck];
          if (typeof v === "object" && v.$ne) return item[ck] !== v.$ne;
          if (typeof v === "object" && v.$regex) return new RegExp(v.$regex, v.$options || "").test(item[ck]);
          return item[ck] === v;
        }))) return false;
        continue;
      }
      const v = query[k];
      if (typeof v === "object" && v.$ne) { if (item[k] === v.$ne) return false; continue; }
      if (typeof v === "object" && v.$regex) { if (!new RegExp(v.$regex, v.$options || "").test(item[k])) return false; continue; }
      if (item[k] !== v) return false;
    }
    return true;
  });
}

export const User = {
  findOne(query) {
    const entry = db.users.find((u) => {
      for (const k in query) { if (u[k] !== query[k]) return false; }
      return true;
    });
    if (!entry) return null;
    const result = clone(entry);
    result._id = result.id;
    result.save = async function () {
      const idx = db.users.findIndex((x) => x.id === this.id);
      if (idx !== -1) {
        const cleaned = { ...this };
        delete cleaned.save;
        Object.assign(db.users[idx], cleaned);
        save();
      }
    };
    return result;
  },
  async find(query) {
    return filterList(db.users, query).map((u) => ({ ...clone(u), _id: u.id }));
  },
  async create(data) {
    const user = { id: genId(), ...data, createdAt: new Date().toISOString(), online: false, lastSeen: new Date().toISOString(), photo: data.photo || "" };
    db.users.push(user);
    save();
    return { ...user, _id: user.id };
  }
};

export const Message = {
  async find(query) {
    return filterList(db.messages, query).map((m) => ({ ...clone(m), _id: m.id }));
  },
  async create(data) {
    const msg = { id: genId(), ...data, isRead: false, isSnap: false, snapOpened: false, createdAt: new Date().toISOString() };
    db.messages.push(msg);
    save();
    return clone(msg);
  },
  async updateMany(query, update) {
    let count = 0;
    for (const msg of db.messages) {
      let match = true;
      if (query.sender !== undefined) match = match && msg.sender === query.sender;
      if (query.receiver !== undefined) match = match && msg.receiver === query.receiver;
      if (query.isRead === false) match = match && !msg.isRead;
      if (match) { Object.assign(msg, update); count++; }
    }
    if (count) save();
    return { modifiedCount: count };
  }
};

load();

export default { User, Message };
