<template>
  
  <div class="main-div"> 
    <div class="sidebar">
      <div>
      <ul>
        <li>
        <i class="far fa-compass" style="font-size: 36px; color: rgb(176, 173, 173);"></i>
      </li>
      <li>
        <i class="far fa-compass" style="font-size: 36px; color:  rgb(176, 173, 173);"></i>
      </li>
      <li>
        <i class="far fa-compass" style="font-size: 36px; color:  rgb(176, 173, 173);"></i>
      </li>
        <li>
        <i class="far fa-compass" style="font-size: 36px; color:  rgb(176, 173, 173);"></i>
      </li>
      <li>
        <i class="far fa-compass" style="font-size: 36px; color:  rgb(176, 173, 173);"></i>
      </li>
        <li>
        <i class="far fa-compass" style="font-size: 36px; color:  rgb(176, 173, 173);"></i>
      </li>
      </ul>
     
    </div>
    <div class="home-icon">
      <ul>
        <li>
          <i class="fa fa-home" style="font-size: 24px; color:  rgb(176, 173, 173);;"></i>
        </li>
      </ul>
    </div>
    </div>

  <div class="app-bar-div-main">
  <div class="app-bar-div">
    <div class="app-bar-div1">
      <p>KPI V3</p>
      <v-btn class="appbar-button">
        <i class="fas fa-cog" style="font-size: 16px; color:  rgba(110, 106, 106, 0.711);"></i>
        company setting
      </v-btn>
    </div>
    <div class="app-bar-div2">
      <v-btn class="appbar-auth-button2">
        Auth
      </v-btn>
      <v-btn class="appbar-help-button2">
       Help
      </v-btn>
    </div>
  </div>
  <div class="app-bar-icons">
    <v-btn class="rounded-top border-bottom-0 m-4">
      KPI List
      <i class="fas fa-times m-2"></i>
    </v-btn>
  </div>

 
  <div class="main-code-container">
  <slot/>
  </div>

 
 
</div>
  

  
  
</div>
   
  </template>
  
  <script>
  import '@fortawesome/fontawesome-free/css/all.css'
  export default {
  };
  </script>
  
  

  <style>
  .sidebar {
    width: 4%;
    height:700px;
    border-right: 2px solid rgb(194, 191, 191);
    background-color: white;
    padding: 8px;
    display: flex;
    margin-bottom: 4%;
    flex-direction: column;
    justify-content: space-around;
  }

 
  .home-icon{
    border-top: 2px solid rgb(178, 177, 177);
  }

  .app-bar-div {
    width: 100%;
    height:10%;
    border-bottom: 2px solid rgb(194, 191, 191);
    background-color: white;
    display: flex;
    font-size: 18px;
    flex-direction: row;
    justify-content: space-between;
    
  }

  .app-bar-div-main {
    width: 100%;
    height:80%;
    min-height: 80%;
    border-bottom: 2px solid rgb(194, 191, 191);
     background-color: rgba(233, 228, 228, 0.419);
    display: flex;
    font-size: 18px;
    flex-direction: column;
    justify-content: space-between;
  }

  .app-bar-icons{
    background-color: rgb(217, 209, 209);
    height: 10%;
    width: 100%;
    padding-left:2% ;
    position: relative;
    border: 2px solid rgb(232, 226, 226);
    
  }

  .app-bar-icons21{
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: -2%;
    

  }

  .app-bar-icons button{
    border-radius: 4px;
    width: 8%;
    border-color:rgb(232, 226, 226) ;
    border-style: none;
  }

  .app-bar-div1 p{
    margin-top: 10px;
  }
  .appbar-button{
   
    font-size: 14px;
    border-radius: 8px;
    height: 40px;
    background-color: rgba(194, 190, 190, 0.715);
    margin-left: 10px;
    border-color: white;
    margin-top:  2%;
  }
  .home-button-inner {
  border: 2px solid rgb(194, 191, 191); /* Match border with div */
  background-color: white; /* Adjust background color as needed */
  padding: 8px;
  cursor: pointer;
  border-top-left-radius: 10px; /* Apply border radius to top-left corner */
  border-top-right-radius: 10px;
  position: relative;
}

.main-code-container{
  width: 100%;
  height: 100%;
 
  padding: 2%;
  
  min-height: 100%;
}

.home-button-inner i {
  font-size: 24px;
  color: rgb(176, 173, 173);
}

.home-button-inner::before {
  content: '';
  position: absolute;
  top: -2%;
  left: -2%;
  width: 104%; /* Extend button by 4% to overlap with div above */
  height: 104%; /* Extend button by 4% to overlap with div above */
  border: 2px solid rgb(194, 191, 191); /* Match border with div */
  
  z-index: -1; /* Behind the button content */
}

  .appbar-auth-button2{
    height: 70%;
    width: 60px;
    border-radius: 8px;
    border-color: white;
    border-right: 2px solid rgb(228, 223, 223);
    background-color: rgb(167, 164, 164);
  }

  .appbar-help-button2{
    height: 70%;
    width: 60px;
    border-radius: 8px;
    background-color: rgb(228, 223, 223);
    border-right: 2px solid rgb(228, 223, 223);
    border-color: white;
    margin-right: 10px;
  }

  .app-bar-div1{
    display: flex;
    padding-left: 2%;
    padding-right: 2%;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-direction: row;
  }

  .app-bar-div2{
    display: flex;
   margin-left: 60%;
   padding-top: 8px;
  }


  .main-div{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }


  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }

  
  
  .sidebar li  {
    text-decoration: none;
    color: #333;
    margin-top: 30%;
    
    margin-bottom: 40%;
  }

  .sidebar div:last-child {
  margin-top: auto; /* This will push the second div to the bottom */
}

.tab-container {
  overflow: hidden;
  border-radius: 8px 8px 0 0; /* Rounded top corners */
}

.tab {
  float: left;
}

.tab button {
  background-color: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: background-color 0.3s;
  border-radius: 0;
}

.tab button:hover {
  background-color: #ddd;
}

.tab button.active {
  background-color: #ccc;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
  </style>
  