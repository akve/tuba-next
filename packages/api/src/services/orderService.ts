import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as i18n from '../utils/i18n';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

const buildOrder = (order: any) => {
  let text = '';
  let html = '';
  order.cart.products.forEach((product: any) => {
    text += `${product.amount} x ${i18n.t(product.name)}, размер ${product.size}, цвет ${product.color} ${
      product.price
    }(грн);;`;
    html += `<tr>
      <td>${product.amount}</td>
      <td>${i18n.t(product.name)} // ${product.color}</td>
      <td>${product.price}</td>
      <td>${product.size}</td>
    </tr>`;
  });
  html = `<table>
    <tr>
      <th>${i18n.t('[U:Кількість][R:Количество]')}</th>
      <th>${i18n.t('Товар')}</th>
      <th>${i18n.t('[U:Ціна][R:Цена]')}</th>
      <th>${i18n.t('[U:Розмір][R:Размер]')}</th>
    </tr>
    ${html}
  </table>`;
  return { text, html };
};

const addToExcel = async (order: any, generatedId: string) => {
  const creds = require('../drive-service-account.json');
  const doc = new GoogleSpreadsheet(process.env.DRIVE_FILE);

  const orderText = buildOrder(order).text;

  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  const row = {
    city: order.data.city,
    address: order.data.delivery,
    name: order.data.firstName + ' ' + order.data.lastName,
    phone: order.data.phone,
    height: 0,
    email: order.data.email,
    order: orderText,
    comments: order.data.comments,
    id: generatedId,
    country: 'ua',
    status: 'new',
    time: new Date().toISOString(),
    where: '',
  };
  await sheet.addRow(row);
};

const sendEmail = async (order: any, generatedId: string) => {
  let { html, text } = buildOrder(order);
  const _T = i18n.t;
  const data = order.data;

  html += _T("<h4>[R:Ваши детали][U:Вашi деталi]:</h4><table class='table' cellpadding=3 cellspacing=3>");
  html += _T("<tr><td>[R:Имя][U:Iм'я]</td><td>") + data.firstName + ' ' + data.lastName + '</td></tr>';
  html += _T('<tr><td>[R:Телефон][U:Телефон]</td><td>') + data.phone + '</td></tr>';
  html += _T('<tr><td>[R:Email][U:Email]</td><td>') + data.email + '</td></tr>';
  html += _T('<tr><td>[R:Город][U:Мiсто]</td><td>') + data.city + '</td></tr>';
  html += _T('<tr><td>[R:Адрес][U:Адреса]</td><td>') + data.delivery + '</td></tr>';
  html += _T('<tr><td>[R:Комментарии][U:Коментар]</td><td>') + data.comments + '</td></tr>';
  html += '</table>';
  html =
    _T('<h3>[R:Спасибо за заказ! <br>Его номер][U:Дякуємо за замовлення!<br> Його номер] ') +
    generatedId +
    '</h3>' +
    html;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'tubadubauk@gmail.com', // generated ethereal user
      pass: process.env.GMAIL_PASSWD, // generated ethereal password
    },
  });
  text = 'Спасибо за заказ! Наш менеджер свяжется с вами: ' + text;
  await transporter.sendMail({
    from: '"Tuba Duba Shop" <tubadubauk@gmail.com>', // sender address
    to: 'tubadubauk@gmail.com', // list of receivers
    subject: `Ваш заказ - ${order.data.email}`, // Subject line
    text: text, // plain text body
    html: html, // html body
  });
  const info = await transporter.sendMail({
    from: '"Tuba Duba Shop" <tubadubauk@gmail.com>', // sender address
    to: order.data.email, // list of receivers
    subject: 'Ваш заказ принят ✔', // Subject line
    text: text, // plain text body
    html: html, // html body
  });
  console.log('Message sent: %s', info.messageId);
};

const sendSMS = async (order: any, generatedId: string) => {
  let phone = order.data.phone;
  if (!phone) return;
  if (phone.indexOf('+') === 0) {
    phone = phone.replace('+', '');
  }
  if (phone.length === 9) {
    phone = `380${phone}`;
  }
  if (phone.length === 10) {
    phone = `38${phone}`;
  }
  const data = {
    recipients: [phone],
    sms: {
      sender: 'Tuba-Duba',
      text: i18n.t(
        `[R:Благодарим за заказ) Мы очень скоро свяжемся с вами, чтобы уточнить все нюансы.][U:Дякуємо за замовлення! Ми дуже швидко зв'яжемося з вами аби уточнити всі нюанси.]`
      ),
    },
  };
  await axios.post('https://api.turbosms.ua/message/send.json', data, {
    headers: { Authorization: `Bearer ${process.env.TURBOSMS_KEY}` },
  });
};

export { addToExcel, sendEmail, sendSMS };
