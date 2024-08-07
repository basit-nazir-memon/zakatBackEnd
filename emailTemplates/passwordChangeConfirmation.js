const passwordChange = (firstName, lastName, resetUrl) => {
    return `
        
        <!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>New email template 2024-08-07</title>
            <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
        <![endif]-->
            <style type="text/css">
                .rollover:hover .rollover-first {
                    max-height: 0px !important;
                    display: none !important;
                }

                .rollover:hover .rollover-second {
                    max-height: none !important;
                    display: block !important;
                }

                .rollover span {
                    font-size: 0px;
                }

                u+.body img~div div {
                    display: none;
                }

                #outlook a {
                    padding: 0;
                }

                span.MsoHyperlink,
                span.MsoHyperlinkFollowed {
                    color: inherit;
                    mso-style-priority: 99;
                }

                a.es-button {
                    mso-style-priority: 100 !important;
                    text-decoration: none !important;
                }

                a[x-apple-data-detectors],
                #MessageViewBody a {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }

                .es-desk-hidden {
                    display: none;
                    float: left;
                    overflow: hidden;
                    width: 0;
                    max-height: 0;
                    line-height: 0;
                    mso-hide: all;
                }

                .es-button-border:hover {
                    border-color: #3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3 !important;
                    background: #ffffff !important;
                }

                .es-button-border:hover a.es-button,
                .es-button-border:hover button.es-button {
                    background: #ffffff !important;
                }

                @media only screen and (max-width:600px) {
                    .es-p-default {}

                    *[class="gmail-fix"] {
                        display: none !important
                    }

                    p,
                    a {
                        line-height: 150% !important
                    }

                    h1,
                    h1 a {
                        line-height: 120% !important
                    }

                    h2,
                    h2 a {
                        line-height: 120% !important
                    }

                    h3,
                    h3 a {
                        line-height: 120% !important
                    }

                    h4,
                    h4 a {
                        line-height: 120% !important
                    }

                    h5,
                    h5 a {
                        line-height: 120% !important
                    }

                    h6,
                    h6 a {
                        line-height: 120% !important
                    }

                    .es-header-body p {}

                    .es-content-body p {}

                    .es-footer-body p {}

                    .es-infoblock p {}

                    h1 {
                        font-size: 20px !important;
                        text-align: center
                    }

                    h2 {
                        font-size: 16px !important;
                        text-align: left
                    }

                    h3 {
                        font-size: 20px !important;
                        text-align: center
                    }

                    h4 {
                        font-size: 24px !important;
                        text-align: left
                    }

                    h5 {
                        font-size: 20px !important;
                        text-align: left
                    }

                    h6 {
                        font-size: 16px !important;
                        text-align: left
                    }

                    .es-header-body h1 a,
                    .es-content-body h1 a,
                    .es-footer-body h1 a {
                        font-size: 20px !important
                    }

                    .es-header-body h2 a,
                    .es-content-body h2 a,
                    .es-footer-body h2 a {
                        font-size: 16px !important
                    }

                    .es-header-body h3 a,
                    .es-content-body h3 a,
                    .es-footer-body h3 a {
                        font-size: 20px !important
                    }

                    .es-header-body h4 a,
                    .es-content-body h4 a,
                    .es-footer-body h4 a {
                        font-size: 24px !important
                    }

                    .es-header-body h5 a,
                    .es-content-body h5 a,
                    .es-footer-body h5 a {
                        font-size: 20px !important
                    }

                    .es-header-body h6 a,
                    .es-content-body h6 a,
                    .es-footer-body h6 a {
                        font-size: 16px !important
                    }

                    .es-menu td a {
                        font-size: 14px !important
                    }

                    .es-header-body p,
                    .es-header-body a {
                        font-size: 10px !important
                    }

                    .es-content-body p,
                    .es-content-body a {
                        font-size: 16px !important
                    }

                    .es-footer-body p,
                    .es-footer-body a {
                        font-size: 12px !important
                    }

                    .es-infoblock p,
                    .es-infoblock a {
                        font-size: 12px !important
                    }

                    .es-m-txt-c,
                    .es-m-txt-c h1,
                    .es-m-txt-c h2,
                    .es-m-txt-c h3,
                    .es-m-txt-c h4,
                    .es-m-txt-c h5,
                    .es-m-txt-c h6 {
                        text-align: center !important
                    }

                    .es-m-txt-r,
                    .es-m-txt-r h1,
                    .es-m-txt-r h2,
                    .es-m-txt-r h3,
                    .es-m-txt-r h4,
                    .es-m-txt-r h5,
                    .es-m-txt-r h6 {
                        text-align: right !important
                    }

                    .es-m-txt-j,
                    .es-m-txt-j h1,
                    .es-m-txt-j h2,
                    .es-m-txt-j h3,
                    .es-m-txt-j h4,
                    .es-m-txt-j h5,
                    .es-m-txt-j h6 {
                        text-align: justify !important
                    }

                    .es-m-txt-l,
                    .es-m-txt-l h1,
                    .es-m-txt-l h2,
                    .es-m-txt-l h3,
                    .es-m-txt-l h4,
                    .es-m-txt-l h5,
                    .es-m-txt-l h6 {
                        text-align: left !important
                    }

                    .es-m-txt-r img,
                    .es-m-txt-c img,
                    .es-m-txt-l img {
                        display: inline !important
                    }

                    .es-m-txt-r .rollover:hover .rollover-second,
                    .es-m-txt-c .rollover:hover .rollover-second,
                    .es-m-txt-l .rollover:hover .rollover-second {
                        display: inline !important
                    }

                    .es-m-txt-r .rollover span,
                    .es-m-txt-c .rollover span,
                    .es-m-txt-l .rollover span {
                        line-height: 0 !important;
                        font-size: 0 !important;
                        display: block
                    }

                    .es-spacer {
                        display: inline-table
                    }

                    a.es-button,
                    button.es-button {
                        font-size: 14px !important;
                        padding: 10px 20px 10px 20px !important;
                        line-height: 120% !important
                    }

                    a.es-button,
                    button.es-button,
                    .es-button-border {
                        display: block !important
                    }

                    .es-m-fw,
                    .es-m-fw.es-fw,
                    .es-m-fw .es-button {
                        display: block !important
                    }

                    .es-m-il,
                    .es-m-il .es-button,
                    .es-social,
                    .es-social td,
                    .es-menu {
                        display: inline-block !important
                    }

                    .es-adaptive table,
                    .es-left,
                    .es-right {
                        width: 100% !important
                    }

                    .es-content table,
                    .es-header table,
                    .es-footer table,
                    .es-content,
                    .es-footer,
                    .es-header {
                        width: 100% !important;
                        max-width: 600px !important
                    }

                    .adapt-img {
                        width: 100% !important;
                        height: auto !important
                    }

                    .es-mobile-hidden,
                    .es-hidden {
                        display: none !important
                    }

                    .es-desk-hidden {
                        width: auto !important;
                        overflow: visible !important;
                        float: none !important;
                        max-height: inherit !important;
                        line-height: inherit !important
                    }

                    tr.es-desk-hidden {
                        display: table-row !important
                    }

                    table.es-desk-hidden {
                        display: table !important
                    }

                    td.es-desk-menu-hidden {
                        display: table-cell !important
                    }

                    .es-menu td {
                        width: 1% !important
                    }

                    table.es-table-not-adapt,
                    .esd-block-html table {
                        width: auto !important
                    }

                    .h-auto {
                        height: auto !important
                    }

                    h2 a {
                        text-align: left
                    }
                }

                @media screen and (max-width:384px) {
                    .mail-message-content {
                        width: 414px !important
                    }
                }
            </style>
        </head>

        <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
            <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA">
                <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#fafafa"></v:fill> </v:background><![endif]-->
                <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
                    <tr style="border-collapse:collapse">
                        <td valign="top" style="padding:0;Margin:0">
                            
                            <table cellpadding="0" cellspacing="0" align="center" class="es-header" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr style="border-collapse:collapse">
                                    <td align="center" class="es-adaptive" style="padding:0;Margin:0">
                                        <table cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center"
                                            class="es-header-body"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3d5ca3;width:600px"
                                            role="none">
                                            <tr style="border-collapse:collapse">
                                                <td bgcolor="#635bff" align="center"
                                                    style="Margin:0;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;background-color:#635bff"> <!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr>
        <td style="width:270px" valign="top"><![endif]-->
                                                    <img width="120px" src="https://zakat-front-end.vercel.app/assets/logo_light.png" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                                <tr style="border-collapse:collapse">
                                    <td bgcolor="#fafafa" align="center" style="padding:0;Margin:0;background-color:#fafafa">
                                        <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"
                                            class="es-content-body"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px"
                                            role="none">
                                            <tr style="border-collapse:collapse">
                                                <td bgcolor="transparent" align="left"
                                                    style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:40px;background-color:transparent;background-position:left top">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top"
                                                                    role="presentation">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                                                            <img src="https://udgnhp.stripocdn.email/content/guids/CABINET_dd354a98a803b60e2f0411e893c82f56/images/23891556799905703.png"
                                                                                alt="" width="175"
                                                                                style="display:block;font-size:16px;border:0;outline:none;text-decoration:none">
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px">
                                                                            <h1
                                                                                style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#333333">
                                                                                <strong>PASSWORD CHANGED </strong></h1>
                                                                            <h1
                                                                                style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:20px;font-style:normal;font-weight:normal;line-height:24px;color:#333333">
                                                                                <strong>&nbsp;SUCCESSFULLY</strong></h1>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;padding-right:40px;padding-left:40px">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;letter-spacing:0;color:#666666;font-size:16px;text-align:center">
                                                                                Hi,&nbsp;${firstName} ${lastName}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;padding-left:40px;padding-right:35px">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;letter-spacing:0;color:#666666;font-size:16px;text-align:center">
                                                                                We are writing to confirm that your password has been successfully changed.</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:25px">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;letter-spacing:0;color:#666666;font-size:16px">
                                                                                If you did not make this change or if you believe an unauthorized person has accessed your account, please reset your password immediately
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="Margin:0;padding-top:40px;padding-right:10px;padding-bottom:40px;padding-left:10px">
                                                                            <span class="es-button-border"
                                                                                style="border-style:solid;border-color:#635bff;background:#FFFFFF;border-width:2px;display:inline-block;border-radius:10px;width:auto"><a

                                                                                    href="${resetUrl}"
                                                                                    target="_blank" class="es-button"
                                                                                    style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#635bff;font-size:14px;padding:15px 20px 15px 20px;display:inline-block;background:#FFFFFF;border-radius:10px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #FFFFFF">RESET
                                                                                    PASSWORD</a></span></td>
                                                                    </tr>

                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:0px">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;letter-spacing:0;color:#666666;font-size:16px">
                                                                                For your security, we recommend that you regularly update your passwords and use unique, strong passwords for each of your online accounts.
                                                                            </p>
                                                                        </td>
                                                                    </tr>


                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;padding-right:40px;padding-left:40px;padding-top:25px; padding-bottom: 20px;">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:24px;letter-spacing:0;color:#666666;font-size:16px">
                                                                                Thank you for being a valued member of Imdaad Foundation
                                                                            </p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" align="center" class="es-footer" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr style="border-collapse:collapse">
                                    <td bgcolor="#fafafa" align="center" style="padding:0;Margin:0;background-color:#fafafa">
                                        <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"
                                            class="es-footer-body" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                                            <tr style="border-collapse:collapse">
                                                <td bgcolor="#635bff" align="left"
                                                    style="Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;padding-bottom:30px;background-color:#635bff;background-position:left top">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px">
                                                                            <h2
                                                                                style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19px;color:#ffffff">
                                                                                <strong>Have quastions?</strong></h2>
                                                                        </td>
                                                                    </tr>
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;padding-bottom:5px">
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">
                                                                                We are here to help, learn more about us <a
                                                                                    target="_blank"
                                                                                    style="mso-line-height-rule:exactly;text-decoration:none;color:#ffffff;font-size:14px"
                                                                                    href="">here</a></p>
                                                                            <p
                                                                                style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:21px;letter-spacing:0;color:#ffffff;font-size:14px">
                                                                                or <a target="_blank"
                                                                                    style="mso-line-height-rule:exactly;text-decoration:none;color:#ffffff;font-size:14px"
                                                                                    href="">contact us</a><br></p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                                <tr style="border-collapse:collapse">
                                    <td bgcolor="#fafafa" align="center" style="padding:0;Margin:0;background-color:#fafafa">
                                        <table cellspacing="0" cellpadding="0" bgcolor="transparent" align="center"
                                            class="es-content-body"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                            role="none">
                                            <tr style="border-collapse:collapse">
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-top:15px;background-position:left top">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:600px">
                                                                <table cellpadding="0" width="100%" cellspacing="0" role="none"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;display:none"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" align="center" class="es-footer" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr style="border-collapse:collapse">
                                    <td bgcolor="#fafafa" align="center" style="padding:0;Margin:0;background-color:#fafafa">
                                        <table cellspacing="0" cellpadding="0" bgcolor="transparent" align="center"
                                            class="es-footer-body"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                            role="none"></table>
                                    </td>
                                </tr>
                            </table>
                            <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                                <tr style="border-collapse:collapse">
                                    <td align="center" style="padding:0;Margin:0">
                                        <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center"
                                            class="es-content-body"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                            role="none">
                                            <tr style="border-collapse:collapse">
                                                <td align="left"
                                                    style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:30px;padding-top:30px">
                                                    <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table width="100%" cellspacing="0" cellpadding="0" role="none"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr style="border-collapse:collapse">
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;display:none"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>

        </html>
    `
}

module.exports = passwordChange;