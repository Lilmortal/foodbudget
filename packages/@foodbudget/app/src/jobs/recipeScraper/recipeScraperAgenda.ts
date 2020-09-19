import Agenda from "agenda";

let instance: Agenda;

export const recipeScraperAgenda = (databaseUrl: string) => {
  if (!instance) {
    instance = new Agenda({
      db: { address: databaseUrl, options: { useUnifiedTopology: true } },
    });
  }

  return instance;
};
