<template>
  <div class="custom__container">
    <div class="contract__details col-12">

      <div class="contract__details_titles">
        <h3>Застройщик</h3>
        <h3>Другие Детали</h3>
      </div>

      <b-form class="contract__details_info">
        <div class="contract__details_info_card">
          <label for="">Компания</label>
          <b-form-input disabled/>
        </div>
      </b-form>

    </div>
  </div>
</template>

<script>
export default {
  name: "ContractTab4"
}
</script>

<style lang="scss" scoped>

.custom__container {
  margin: 32px 90px;
  background: #fff;
  height: 80vh;
}

.contract__details {

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
    }
  }

  .form-control:disabled {
    background: #fff;
  }
}


</style>