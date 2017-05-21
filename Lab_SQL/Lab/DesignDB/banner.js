banner1='<style type=text/css><!--';
banner2='.small { font-family: 細明體, 新細明體; font-style: normal; font-size: 8pt;}';
banner3='--></style>';
banner4='<center><TABLE cellSpacing=0 cellPadding=1 border=0 bgcolor=C5BDAF width=570><TR><TD align=center>';
banner5='<TABLE cellSpacing=0 cellPadding=0 border=0 width=100% bgcolor=ffffff>';
banner6='<TR><TD align=center width=450 rowspan=2>';
banner7='<IFRAME WIDTH=468 HEIGHT=63 MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 FRAMEBORDER=0 SCROLLING=no BORDERCOLOR=#ffffff src=http://ad.pchome.com.tw/ad/banner_new.html>';

banner_N='<script language=JavaScript src=http://kernel3.adver.com.tw/adver/Rnams/home_new3.js><\/script>';

banner8='</IFRAME></TD><TD align=center width=120>';
banner9='<img src=http://ad.pchome.com.tw/ad/new4-3.gif height=24 alt= border=0>';
banner10='</TD></TR><TR><TD class=small><font color=333333>';
banner11='&nbsp;‧<a target=_new href=http://www.pchome.com.tw><font color=2233ca>PC home</font></a><br>';
banner12='&nbsp;‧<a target=_new href=http://home.pchome.com.tw><font color=2233ca>個人網頁首頁</font></a>';
banner13='</font><br></TD></TR></table></TD></TR></table></center>';

function banner() {

  v=parseFloat(navigator.appVersion);
  document.write(banner1);
  document.write(banner2);
  document.write(banner3);
  document.write(banner4);
  document.write(banner5);
  document.write(banner6);
  document.write(banner7);
  if (v < 5) { 
    document.write(banner_N);
  }
  document.write(banner8);
  document.write(banner9);
  document.write(banner10);
  document.write(banner11);
  document.write(banner12);
  document.write(banner13);
}

if (parent.length==0) {
  banner();
}
else {
  var thispage="";
  document.write("&nbsp;");
  if (self.document.body) { thispage=self.document.body; }
  else if (document.body) { thispage=document.body; }
  else if (document) { thispage=document; }

  if ((thispage.clientWidth) && (thispage.clientHeight)) {
    if ((thispage.clientWidth > 600) && (thispage.clientHeight > 200)) {
      banner();
    }
  }
  else if ((innerWidth) && (innerHeight)) { 
    if ((innerWidth > 600) && (innerHeight > 200)) {
      banner();
    }
  }
  else {
    document.onload=window.open('http://ad.pchome.com.tw/ad/ad.html', 'popup', 'directories=no,location=no,menubar=no,toolbar=no,scrollbars=no,height=60,width=600,screenX=200,screenY=200');
  }
}
