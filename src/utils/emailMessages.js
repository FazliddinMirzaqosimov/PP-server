const nodemailer = require("nodemailer");
const { EMAIL_USERNAME, EMAIL_PASSWORD } = require("../shared/const");
const { isValidEmail } = require("./validators/emailValidator");

function sendMail(options) {
  if (!isValidEmail(options.to)) {
    throw new Error("Email is not valid!")
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: "587",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  return transporter.sendMail(options);
}

exports.sendRegisterEmail = (link, to) => {
  const options = {
    from: '"fazliddin.dev Platformasi" <foo@example.com>',
    to: to,
    subject: "Dunyoni zabt qilish vaqti keldi!",
    html: `Fazliddin.dev ni tanlaganingiz uchun tashakkur! Roʻyxatdan oʻtishni yakunlash uchun quyidagi tugmani bosing:
    <br/>
    <br/> 
    <a href="${link}">

    <button
    style="
          color: white;
          padding: 10px 20px;
          font-family: sans-serif;
          font-size: 20px;
           background-color: rgb(0, 106, 255);border-radius: 5px;border: none;
          "
      >
      Ro'yxatdan o'tish
    </button>
  </a>
  <br/>
  <br/>

    Bu link sizga <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> platformasida akkaunt ochishingiz uchun jo'natildi. Agar platformadan ro'yxatdan o'tish niyyatingiz bo'lmasa emailga ahamiyat bermang!
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a>   saytida biz sizning ehtiyojlaringizga moslashtirilgan uzluksiz o‘rganish tajribasini taqdim etishga intilamiz. Turli kurslarni o'rganing, hamjamiyatimiz bilan aloqa o'rnating va bilim olamini oching.
    <br/>
    <br/>

    Agar sizda biron bir savol bo'lsa yoki yordamga muhtoj bo'lsangiz, bizning qo'llab-quvvatlash guruhimizga fazliddinmirzaqosimov8@gmail.com manzili orqali murojaat qiling.
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> jamoasiga xush kelibsiz!
    <br/>
    <br/>

    Eng yaxshi ezgu tilaklar bilan,
    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> jamoasi`,
  };
  return sendMail(options);
};

exports.sendUpdateEmailCode = (code, to) => {
  const options = {
    from: '"fazliddin.dev Platformasi" <foo@example.com>',
    to: to,
    subject: "Emailingizni o'zgartirish kodi!",
    html: `Fazliddin.dev ni tanlaganingiz uchun tashakkur. Sizni kemada borligimizdan xursandmiz! Roʻyxatdan oʻtishni yakunlash uchun quyidagi tugmani bosing:
    <br/>
    <br/> 
    <div style="padding: 30px; text-align: center">
    <p
      style="
        font-family: sans-serif;
        letter-spacing: 5px;
        font-size: 20px;
        color: #202020;
        background-color: #e0e0e0;
        display: inline;
        padding: 5px 15px;
        border-radius: 5px;
      "
    >
      ${code}
    </p>
  </div>


  <br/>
  <br/>

    Bu link sizga <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> platformasida emailingizni yangilash uchun jo'natildi. Agar emailingizni o'zgartirish niyyatingiz bo'lmasa xabarimizga ahamiyat bermang!
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a>   saytida biz sizning ehtiyojlaringizga moslashtirilgan uzluksiz o‘rganish tajribasini taqdim etishga intilamiz. Turli kurslarni o'rganing, hamjamiyatimiz bilan aloqa o'rnating va bilim olamini oching.
    <br/>
    <br/>

    Agar sizda biron bir savol bo'lsa yoki yordamga muhtoj bo'lsangiz, bizning qo'llab-quvvatlash guruhimizga fazliddinmirzaqosimov8@gmail.com manzili orqali murojaat qiling.
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a>  jamoasiga xush kelibsiz!
    <br/>
    <br/>

    Eng yaxshi ezgu tilaklar bilan,
    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> jamoasi`,
  };
  return sendMail(options);
};


exports.sendNewPasswordCode = (code, to) => {
  const options = {
    from: '"fazliddin.dev Platformasi" <foo@example.com>',
    to: to,
    subject: "Parolingizni yangilash kodi!",
    html: `Fazliddin.dev ni tanlaganingiz uchun tashakkur. Sizni kemada borligimizdan xursandmiz! Parolni o'zgartirish uchun quyidagi tugmani bosing:
    <br/>
    <br/> 
    <div style="padding: 30px; text-align: center">
    <p
      style="
        font-family: sans-serif;
        letter-spacing: 5px;
        font-size: 20px;
        color: #202020;
        background-color: #e0e0e0;
        display: inline;
        padding: 5px 15px;
        border-radius: 5px;
      "
    >
      ${code}
    </p>
  </div>


  <br/>
  <br/>

    Bu link sizga <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> platformasida parolingizni yangilash uchun jo'natildi. Agar parolingizni o'zgartirish niyyatingiz bo'lmasa xabarimizga ahamiyat bermang!
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a>   saytida biz sizning ehtiyojlaringizga moslashtirilgan uzluksiz o‘rganish tajribasini taqdim etishga intilamiz. Turli kurslarni o'rganing, hamjamiyatimiz bilan aloqa o'rnating va bilim olamini oching.
    <br/>
    <br/>

    Agar sizda biron bir savol bo'lsa yoki yordamga muhtoj bo'lsangiz, bizning qo'llab-quvvatlash guruhimizga fazliddinmirzaqosimov8@gmail.com manzili orqali murojaat qiling.
    <br/>
    <br/>

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a>  jamoasiga xush kelibsiz!
    <br/>
    <br/>

    Eng yaxshi ezgu tilaklar bilan,
    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> jamoasi`,
  };
  return sendMail(options);
};

exports.sendMail = sendMail;
