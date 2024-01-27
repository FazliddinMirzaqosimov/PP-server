const nodemailer = require("nodemailer");

function sendMail(options) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: "587",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter.sendMail(options);
}

function sendRegisterEmail(link, to) {
  const options = {
    from: '"fazliddin.dev Platformasi" <foo@example.com>',
    to: to,
    subject: "Dunyoni zabt qilish vaqti keldi!",
    html: `Fazliddin.dev ni tanlaganingiz uchun tashakkur. Sizni kemada borligimizdan xursandmiz! Roʻyxatdan oʻtishni yakunlash uchun quyidagi tugmani bosing:
    <br/>
    <br/>"${link}"
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

    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> hamjamiyatiga xush kelibsiz!
    <br/>
    <br/>

    Eng yaxshi ezgu tilaklar bilan,
    <a href="https://fazliddin.dev"> <b>Fazliddin.dev</b></a> jamoasi`,
  };
 return  sendMail(options);
}

// sendRegisterEmail("https://login.com", "nextech.uz@gmail.com");

 exports.sendRegisterEmail = sendRegisterEmail;
exports.sendMail = sendMail;
