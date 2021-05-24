export const contributionAlertMail = (data: {
  name: string;
  amount: number;
  balance: number;
  contributor: string;
  currency: string;
}) => `
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
  <!--<![endif]-->
  <style>
    body {
      font-family: 'Helvetica', 'Arail', sans-serif;
      background: #232425;
    }

    .mail-area {
      background: #fff;
      width: 80%;
      margin: auto;
    }

    .mail-header {
      width: 100%;
      background: rgb(59, 171, 89) 100%;
      height: 80px;
    }

    .mail-content {
      margin: auto;
      background: #fff;
    }

    .mail-content p {
      color: #333;
      font-size: 12px;
      font-weight: 100;
    }

    .mail-content a {
      background: #fff;
      padding: 10px 30px;
      margin-top: 30px;
      border-radius: 30px;
      color: #3bab59;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
    }

    .mail-footer {
      margin-top: 50px;
      background: #58A75D;
    }

    .mail-footer p {
      font-size: 14px;
      line-height: 25px;
    }

    .mail-footer p a {
      padding: 0;
      box-shadow: none;
      font-size: 14px;
      color: #000;
      text-decoration: underline;
      background: none;
    }

    .ballons {
      width: 300px;
      margin: auto;
      margin: -40px auto 70px auto;
    }

    .footer-logo-area {
      width: 60%;
      margin: auto;
    }

    .mail-sub-footer {
      display: flex;
      width: 60%;
      margin: auto
    }

    .mail-sub-footer p {
      color: #fff;
      width: 60%;
      margin: auto;
      padding: 30px 0;
      font-size: 10px;
      font-weight: 100;
    }

    @media (max-width: 768px) {
      .mail-sub-footer {
        flex-direction: column;
      }

      .mail-sub-footer p {
        width: 100%;
        padding: 10px 0;
      }
    }
  </style>
</head>

<body>
  <div class="mail-area">    
    <div class="mail-content"><br />
      <div class="mail-brief" style="width: 80%; margin: auto;">
        <p style="font-size: 25px;">Hello ${data.name},</p>
        <p style="line-height: 20px; font-size: 13px;">Your registry account has been credited by <strong>${
          data.contributor
        }</strong>, with the sum of <strong>${data.currency} ${
  data.amount / 100
}</strong>.</p> 
        <p style="line-height: 20px; font-size: 13px;">Your account balance is <strong>${
          data.currency
        } ${data.balance / 100}</strong>.</p>        
        <br />
      </div>
    </div>
  </div>
</body>

</html>
`;
