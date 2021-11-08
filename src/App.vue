<template>
  <div id="app">
    <header-block></header-block>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      onLine: navigator.onLine,
    };
  },
  methods: {
    updateOnlineStatus(e) {
      const {type} = e;
      this.onLine = type === "online";
    },
  },
  watch: {
    onLine(v) {
      if (v) {
        this.$toasted.clear();
        this.$toasted.show("Подключен к интернету!", {
          theme: "toasted-primary",
          position: "top-right",
          duration: 5000,
          type: "success",
          fitToScreen: true,
        });
      } else {
        this.$toasted.show("Нет подключения к Интернету", {
          theme: "toasted-primary",
          position: "top-right",
          duration: null,
          type: "error",
        });
      }
    },
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
};
</script>

<style>
.btn {
  box-shadow: unset !important;
  padding: 8px 20px !important;
  border-radius: 6px !important;
}
.btn-primary {
  color: #fff;
  background-color: #5851d8 !important;
  border-color: #5851d8 !important;
}

.btn-primary:hover {
  color: #fff;
  background-color: #463ed3 !important;
  border-color: #463ed3 !important;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3),
    -2px -2px 6px rgba(255, 181, 202, 0.31) !important;
}

.btn-success {
  color: #fff;
  background-color: #45a85c !important;
  border-color: #45a85c !important;
}

.btn-success:hover {
  color: #fff;
  background-color: #429c57 !important;
  border-color: #429c57 !important;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3),
    -2px -2px 6px rgba(255, 181, 202, 0.31) !important;
}

img[lazy="error"] {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
table.b-table[aria-busy="true"] {
  opacity: 0.6;
}

.custom-table table tbody tr td {
  font-size: 16px;
  font-family: "MuseoSansCyrl-300";
  color: black;
}

.custom-table table tr th,
.custom-table table tr td {
  padding: 15px 25px;
  vertical-align: middle;
}

.custom-table table tbody tr,
.custom-table table thead tr {
  background-color: white;
  border-radius: 6px;
  box-shadow: -2px -2px 7px #ffffff73, 1px 1px 5px rgba(94, 104, 121, 0.288);
}

.custom-table table thead tr th {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 25px !important;
  font-size: 14px;
  font-family: "MuseoSansCyrl-700";
  color: #222222;
  border-bottom: 1px solid rgba(190, 190, 190, 0.336);
  text-transform: uppercase;
}
.custom-table tr {
  background-color: transparent;
  transition: all 0.3s ease-in;
}

.custom-table tr th:first-of-type,
.custom-table tr td:first-of-type {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.custom-table tr th:last-of-type,
.custom-table tr td:last-of-type {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.custom-table table {
  padding: 20px 0;
  border-collapse: separate;
  border-spacing: 0 1em;
}

.custom-table table tbody tr:hover {
  background-color: transparent;
  -webkit-box-shadow: 0px 3px 9px 1px rgb(5 8 9 / 8%);
  box-shadow: 0px 3px 9px 1px rgb(5 8 9 / 8%);
}

.custom-table.b-table-sticky-header {
  max-height: 75vh;
}

.custom-table.b-table-sticky-header::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.custom-table.b-table-sticky-header::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

.custom-table.b-table-sticky-header::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0);
  border-radius: 0;
}

.custom-table.b-table-sticky-header::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0);
}

.table.b-table > thead > tr > [aria-sort].b-table-sort-icon-left,
.table.b-table > tfoot > tr > [aria-sort].b-table-sort-icon-left {
  background-position: left calc(1rem / 2) center;
  padding-left: calc(0.75rem + 0.65em);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination .page-item a {
  margin: 0 5px;
  border: 0;
  width: 40px;
  height: 40px;
  border-radius: 6px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: -2px -2px 7px #ffffff73, 1px 1px 5px rgba(94, 104, 121, 0.288);
}
.pagination .page-item.active a {
  background-color: #5851d8;
  border-color: #5851d8;
}

.page-link:focus {
  box-shadow: unset !important;
}

.fixed-menu,
.object__link {
  box-shadow: -2px -2px 7px #ffffff73, 1px 1px 5px rgba(94, 104, 121, 0.288);
}
</style>
