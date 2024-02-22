type arbitrarycredtype = "username" | "mail" | "password";

export const Randomcred = (credtype: arbitrarycredtype) => {

  const username: (unames: string[]) => string = (unames: string[]) => {
    if(unames.length !== 0) {
      const randomUsername: string = unames[Math.floor(Math.random()*3)]+Math.floor(Math.random()*4);
      return randomUsername;
    } else {
      const anonUsername: string = `anonymous${Math.floor(Math.random()*9999)}`;
      return anonUsername;
    }
  }
  
  const mail: () => string = () => {
    const randomMail: string = `ao${Math.floor(Math.random()*9999)}@anonymous.com`;
    return randomMail;
  }

  const password: () => string = () => {
    const randomPassword: string = Math.random().toString(36).substring(2,19);    
    return randomPassword;
  }
  
  const arbitraryCred:  Record<arbitrarycredtype, (unames?: any) => string> = {
    username,
    mail,
    password
  }

  return arbitraryCred[credtype];
}
  
