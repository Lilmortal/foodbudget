import { Emailer } from "./Emailer";
import { EmailError } from "./EmailError";

describe("emailer", () => {
  beforeEach(() => {
    jest.setTimeout(15000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it("should send a mail", async () => {
    const emailer = await Emailer.createTestAccount();

    const url = await emailer.send({
      from: emailer.auth.user,
      to: emailer.auth.user,
      subject: "Test",
      text: "Text message",
      html: "<b>HTML</b>",
    });

    // If given a URL, it means the mail has been successfully sent.
    // We don't need to verify the content.
    expect(url).not.toBeUndefined();
  });

  it("should throw an EmailerError given invalid credentials", async () => {
    expect(
      Emailer.create({
        service: "smtp.ethereal.email",
        auth: { user: "fake user", pass: "fake pass" },
      })
    ).rejects.toThrowError(EmailError);
  });
});
