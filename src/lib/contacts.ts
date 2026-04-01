// Emergency contacts stored in localStorage

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const CONTACTS_KEY = "emergency_locator_contacts";

export const getContacts = (): EmergencyContact[] => {
  const raw = localStorage.getItem(CONTACTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveContacts = (contacts: EmergencyContact[]) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const addContact = (contact: Omit<EmergencyContact, "id">): EmergencyContact => {
  const contacts = getContacts();
  const newContact = { ...contact, id: crypto.randomUUID() };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

export const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
  const contacts = getContacts().map((c) => (c.id === id ? { ...c, ...updates } : c));
  saveContacts(contacts);
};

export const deleteContact = (id: string) => {
  saveContacts(getContacts().filter((c) => c.id !== id));
};
