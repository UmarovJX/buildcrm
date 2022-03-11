<template>
  <div class="custom__container">

    <div class="client__details col-12">
      <div class="client__details_titles d-flex">
        <h3>Основные</h3>
        <h3>Паспортные данные</h3>
      </div>

      <b-form class="client__details_info">

        <div class="client__details_info_card">
          <label for="">ФИО</label>
          <b-form-input disabled />
        </div>

        <div class="client__details_info_card">
          <label>Тип клиента</label>
          <b-form-select v-model="selected" :options="options" size="lg" class="mt-3"></b-form-select>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#7C3AED"/>
            <path
                d="M11.6992 9.70962L14.7992 12.1775C14.874 12.2365 14.8868 12.3448 14.8284 12.4203L11.1532 17.1382C10.9222 17.4297 10.5817 17.5945 10.217 17.6006L8.21066 17.625C8.10366 17.6262 8.01003 17.5532 7.98571 17.4485L7.52973 15.4954C7.4507 15.1364 7.52973 14.7652 7.76076 14.4793L11.4542 9.73883C11.5138 9.66277 11.6238 9.64939 11.6992 9.70962Z"
                fill="white"/>
            <path
                d="M16.188 10.7067L15.5903 11.4417C15.5301 11.5166 15.4219 11.5287 15.3471 11.4691C14.6206 10.8899 12.7602 9.40342 12.2441 8.9915C12.1687 8.93066 12.1584 8.82235 12.2191 8.7469L12.7955 8.04171C13.3184 7.3785 14.2303 7.31765 14.966 7.89568L15.811 8.55889C16.1576 8.82661 16.3886 9.17951 16.4676 9.55067C16.5588 9.95894 16.4616 10.3599 16.188 10.7067Z"
                fill="white"/>
          </svg>

        </div>

      </b-form>
    </div>

  </div>
</template>

<script>
export default {
  name: "ContractTab3",
  data() {
    return {
      selected: null,
      options: [
        { value: "Незнакомый", text: "Незнакомый" },
        { value: "Знакомый", text: "Знакомый" }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.custom__container {
  margin: 32px 90px;
  background: #fff;
  height: 80vh;
}

.client__details {
  display: flex;
  flex-direction: column;

  &_titles {
    display: flex;
    justify-content: space-between;

    & h3 {
      width: 48%;
      font-size: 24px;
      font-weight: 900;
      color: #9CA3AF;
      margin: 32px 0 16px;
    }
  }

  &_info {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    &_card {
      display: flex;
      align-items: center;
      width: 48%;
      height: 56px;
      border: 2px solid #E5E7EB;
      border-radius: 32px;
      padding: 0 16px;
      position: relative;
      margin-top: 16px;

      & svg {
        position: absolute;
        right: 20px;
        //z-index: 100;
      }

      & label {
        text-transform: uppercase;
        margin: 0;
        padding-right: 10px;
        color: #9CA3AF;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
      }

      select {
        width: 140px;
        height: 24px;
        padding: 0;
        margin-top: 0 !important;
        position: absolute;
        top: 45%;
        transform: translateY(-50%);
        right: 20px;
        border: none;

        option {
          padding: 20px;
          border: none;
        }
      }
    }
  }

  .form-control:disabled {
    background: #fff;
  }
}

</style>