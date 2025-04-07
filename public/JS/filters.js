let taxSwitch=document.getElementById("flexSwitchCheckDefault");
taxSwitch.addEventListener("click",()=>{
 let taxInfo=document.getElementsByClassName("tax-info");
 for(info of taxInfo){
  if(info.style.display!="inline"){
    info.style.display="inline"; 
  }else{
    info.style.display="none";
  }
 }
})

const categoryScroll = document.getElementById('categoryScroll');

function scrollLeftFunc() {
    categoryScroll.scrollBy({ left: -200, behavior: 'smooth' });
    console.log("right");
}

function scrollRightFunc() {
    categoryScroll.scrollBy({ left: 200, behavior: 'smooth' });
    console.log("left");
}