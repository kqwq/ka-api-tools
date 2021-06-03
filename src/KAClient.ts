import fetch from "node-fetch"

class KAClient {
  KAAS: string;
  constructor(KAAS?: string) {
    this.KAAS = KAAS || "";
  }

  /**
   * Generates KAAS key from username and password
   * @return Http status code of login attempt
   */
  async fromCredentials(username: string, password: string): Promise<number> {
    let res = await fetch(
      "https://www.khanacademy.org/api/internal/graphql/loginWithPasswordMutation",
      {
        headers: {
          "content-type": "application/json",
          "x-ka-fkey": "none",
          cookie: "fkey=none",
        },
        body: JSON.stringify({
          operationName: "loginWithPasswordMutation",
          query:
            "mutation loginWithPasswordMutation($identifier: String!, $password: String!) {\n  loginWithPassword(identifier: $identifier, password: $password) {\n    user {\n      id\n      kaid\n      canAccessDistrictsHomepage\n      isTeacher\n      hasUnresolvedInvitations\n      transferAuthToken\n      preferredKaLocale {\n        id\n        kaLocale\n        status\n        __typename\n      }\n      __typename\n    }\n    isFirstLogin\n    error {\n      code\n      __typename\n    }\n    __typename\n  }\n}",
          variables: {
            identifier: username,
            password: password,
          },
        }),
        method: "POST",
      }
    );

    let data = await res.headers.get("set-cookie");
    this.KAAS = "error";
    if (data) {
      let matchKAAS = data.match(/KAAS=([\w-]+)/);
      if (matchKAAS) {
        this.KAAS = matchKAAS[1];
      }
    }

    return res.status;
  }
}
//So we need a few things...
//Comment interface, so we can have functions that accept comments to respond/load comments on tthe,

//Ok discovered a few things...
//After making an initial comment upon a project, the KAencrypted key that is returned can be used to make a comment on that comment.

export interface commentAuthorBase {
  authorAvatarName: string;
  authorAvatarSrc: string;
  authorKaid: string;
  authorNickname: string;
}

export interface Comment {
  answerCount: number;
  appearsAsDeleted: boolean;

  key: string;
  badges: any; // Not implimenting badgess until later
  content: string;
  date: string;
  /**
   * Only true if message is from a gaurdian.
   */
  definitelyNotSpam: boolean;
  /**
   *
   */
  downVoted: boolean;
}

export { KAClient }