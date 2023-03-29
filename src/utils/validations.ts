export default class Validations {
  public static required = (value: string): true | string => value !== "" || "入力してください。";
  public static email = (value: string): true | string => {
    const pattern = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    return pattern.test(value) || "無効なメールアドレスです。";
  };

  public static password = (value: string): true | string => {
    const pattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,100}$/;
    return pattern.test(value)
      ? true
      : value.length >= 8
        ? "英大文字・英小文字・数字をすべて含めてください。"
        : "8文字以上にしてください。";
  };
}
