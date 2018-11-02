<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="silent-print"> -->
    <main>
      <el-container>
        <el-header>
          <h1>{{$store.state.Printer.state}}</h1>
        </el-header>
        <el-main>
           <el-tabs :tab-position="''" style="height: 200px;">
              <el-tab-pane label="本机打印设备">
               <el-tag style="margin: 4px;"  v-for="item in $store.state.Printer.printers" :key="item.name">{{item.name}} </el-tag>
              </el-tab-pane>
            </el-tabs>
        </el-main>
        <el-footer>
          <system-information></system-information>
        </el-footer>
      </el-container>
    </main>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import { ipcRenderer } from "electron";

export default {
  name: "landing-page",
  data() {
    return {
      status: this.$store.state.Printer.state,
      value7: 100
    }
  },
  components: { SystemInformation },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  },
  created: function() {
    ipcRenderer.send("web-created", data => {
      console.log(data);
    });
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
