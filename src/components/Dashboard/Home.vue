<template>
  <main>
    <div class="app-content">
      <div
        class="
          d-flex
          justify-content-between
          align-items-center
          flex-md-row flex-column
          pb-3
        "
      >
        <div
          class="d-flex w-100 align-items-center flex-md-row flex-column mb-0"
        >
          <h1 class="title__big my-0">
            {{ $t("home.title") }}
          </h1>
        </div>
      </div>

      <div class="container-fluid px-0 mx-0">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div
                class="col-lg-3 col-md-6 mb-md-0 mb-3"
                v-if="getPermission.objects && getPermission.objects.view"
              >
                <router-link :to="{name: 'objects'}">
                  <div class="card-counter primary">
                    <i class="far fa-building"></i>
                    <span class="count-numbers" v-if="getHomeCounts.counts && getHomeCounts">{{
                      getHomeCounts.counts.objects
                    }}</span>
                    <span class="count-name">{{ $t("objects.title") }}</span>
                  </div>
                </router-link>
              </div>

              <!-- <div class="col-lg-3 col-md-6 mb-md-0 mb-3" v-if="getPermission.clients.view">
          <router-link :to="{name: 'clients'}">
            <div class="card-counter danger">
              <i class="far fa-users-class"></i>
              <span class="count-numbers">{{
                getHomeCounts.counts.clients
              }}</span>
              <span class="count-name">{{ $t("clients.title") }}</span>
            </div>
          </router-link>
        </div> -->

              <div
                class="col-lg-3 col-md-6 mb-md-0 mb-3"
                v-if="getPermission.users && getPermission.users.view"
              >
                <router-link :to="{name: 'users'}">
                  <div class="card-counter success">
                    <i class="far fa-users"></i>
                    <span class="count-numbers" v-if="getHomeCounts.counts">{{
                      getHomeCounts.counts.users
                    }}</span>
                    <span class="count-name">{{ $t("users.title") }}</span>
                  </div>
                </router-link>
              </div>

              <!--                <div class="col-lg-3 col-md-6 mb-md-0 mb-3">-->
              <!--                    <div class="card-counter info">-->
              <!--                        <i class="far fa-cogs"></i>-->
              <!--                        <span class="count-numbers"></span>-->
              <!--                        <span class="count-name">{{ $t('settings.title') }}</span>-->
              <!--                    </div>-->
              <!--                </div>-->

              <div
                class="col-lg-3 col-md-6 mb-md-0 mb-3"
                v-if="getPermission.apartments && getPermission.apartments.view"
              >
                <router-link :to="{name: 'objects-filter'}">
                  <div class="card-counter apartments">
                    <i class="far fa-home"></i>
                    <span class="count-numbers" v-if="getHomeCounts.counts">{{
                      getHomeCounts.counts.apartments
                    }}</span>
                    <span class="count-name">{{
                      $t("objects.apartments")
                    }}</span>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import home from '../../services/home'
export default {
  data: () => ({}),

  // async created() {
  //   await home.getHomeInfo().then(response => {
  //     console.log(response)
  //   })
  // },

  mounted() {
    this.fetchCounts(this);
  },

  computed: mapGetters(["getHomeCounts", "getPermission"]),

  methods: {
    ...mapActions(["fetchCounts"]),
  },
};
</script>

<style>
.card-counter {
  box-shadow: 2px 2px 10px #dadada;
  padding: 25px 16px;
  background-color: var(--background-color-nav);

  height: 200px;
  transition: 0.3s linear all;
  border-radius: 0.428rem;
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
}

.card-counter:hover {
  transition: 0.3s linear all;
}

.card-counter.primary {
  background-color: #0068d6;
  color: #fff;
}

.card-counter.danger {
  background-color: #ff5c59;
  color: #fff;
}

.card-counter.success {
  background-color: #52a756;
  color: #fff;
}

.card-counter.info {
  background-color: #2daebe;
  color: #fff;
}

.card-counter.apartments {
  background-color: #9267d6;
  color: #fff;
}

.card-counter i {
  font-size: 6rem;
  opacity: 0.2;
  position: absolute;
  bottom: 0;
}

.card-counter .count-numbers {
  position: absolute;
  right: 35px;
  top: 20px;
  font-size: 42px;
  display: block;
}

.card-counter .count-name {
  position: absolute;
  right: 35px;
  top: 75px;
  font-style: italic;
  text-transform: capitalize;
  opacity: 0.5;
  display: block;
  font-size: 22px;
}
</style>
