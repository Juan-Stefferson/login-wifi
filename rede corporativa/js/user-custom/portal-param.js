var strategyInfo="Default Guest";//Guest或BYOD的策略名
var useFor="Guest"; //Guest or BYOD;
var loginBy="account";//account:账号密码方式登陆，accessCode:接入码方式登陆，termsOfUse:一键登录
var socialLogin=false;//是否开启Social Login功能
var facebookID = "744629352412846";//Facebook OAuth ID
var googleID = "312066149603-4e1032asf8s9bvci63hem2932keqvugv.apps.googleusercontent.com";//Google OAuth ID
var aleRainbowOAuthClientID = "6d65ac708b5d11e99c576faddce77f49";
var successRedirect="successPage";//successPage:跳转到成功页面，initialURL:跳转到用户源访问地址，fixedURL:跳转到指定地址
var fixedURL="";//如果successRedirect为fixedURL，则认证成功后跳转到该URL
var selfRegistration=true;//是否开启自注册功能
var reqiredAttributes=["Guest Name","Password","Full Name","Email Id","Phone Number","Company","Position","Department","Country or Region","Employee Visited","Employee Email ID","Employee Phone Number","Reason Visited"];//数组中指定的输入框需要在自注册页面中显示出来，未显示的不需要校验
var allowedEmailSuffix=["@han-networks.com","@126.com"];//如果Employee Email ID是需要显示的，那么他后边的下拉框里绑定的values为这个数组中的值
var serviceLevels=[{name:"Basic Service",value:1},{name:"Premium Service",value:2},{name:"Free Service",value:3}];//如果该数组不为空，则需要在登陆的账号密码后边，登陆按钮前，增加serviceLevel的下拉选择框
var locationEnable=true;
var locationList=['123','weqewe','qwewdsa'];
var successNotification=true;
var portalServiceUrl="";
var authorizeVerificationCode = false;
var emailRestriction="";
var weChatAppID = "wxc7ac7ed1a1c7c699";
var weChatShopID = "17466490";
var weChatSecrectKey = "7a4b4c5b7ae5c6d6cef2612b5f1e37af";
var loginCustomAttrList = [{name: "Company"}, {name: "Family Name"}];
var selfRegisterCustomAttrList = [{name: "Name"}, {name: "Age"}];
var openAppId="wx02a74655cbec102a";
var appSecret="b6cd6cb8823c7a2f17435c65efb428c3";
var pwdReset = 3;//0: Disabled; 1: By E-mail; 2: By SMS; 3: By E-mail/SMS
var dataQuotaUrl="";