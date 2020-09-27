import config from "./config";
import { AgendaJobError } from "./jobs/agendaJob";
import { ScrapeError } from "./jobs/scraper";
import { StatusError } from "./shared/errors";
import { RepositoryError } from "./repository/RepositoryError";
import { EmailError, Mail } from "./services/email";
import { Mailer } from "./services/email/Emailer.types";

const isStatusError = (err: any): err is StatusError =>
  err.status !== undefined;

interface HandleErrorParams {
  err: any;
  emailer?: Mailer;
}

export const handleError = async ({ err, emailer }: HandleErrorParams) => {
  const sendErrorEmail = async (
    subject: string,
    text: string,
    html?: string
  ) => {
    try {
      // @TODO: Add from and to back when we fixed most of the issues.
      const mail: Pick<Mail, "from" | "to"> = {
        // from: config.email.user,
        // to: config.email.user,
        from: "",
        to: "",
      };

      await emailer?.send({ ...mail, subject, text, html });
    } catch (err) {
      await handleError({
        err: new EmailError("failed to send an error report email."),
        emailer,
      });
    }
  };

  if (isStatusError(err)) {
    if (err instanceof ScrapeError) {
      console.log("Scraping error. \n", err.message);
      await sendErrorEmail("Error", "");
      return;
    }

    if (err instanceof AgendaJobError) {
      console.log("Job scheduler error. \n", err.message);
      await sendErrorEmail("Error", "");
      return;
    }

    if (err instanceof RepositoryError) {
      console.log("Database error. \n", err.message);
      await sendErrorEmail("Error", "");
      return;
    }

    if (err instanceof EmailError) {
      console.log("Email service error. \n", err.message);
      return;
    }

    if (err instanceof StatusError) {
      console.log(err.message);
      await sendErrorEmail("Error", "");
      return;
    }
  } else {
    if (err instanceof Error) {
      console.log(err.message);
      await sendErrorEmail("Error", "");
      return;
    }
    console.log(err);
    await sendErrorEmail("Error", "");
  }
};
