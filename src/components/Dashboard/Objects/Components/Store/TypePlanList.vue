<template>
    <table class="table table-striped" v-if="plans && plans.length > 0">
        <thead>
        <tr>
            <th scope="col" width="10">#</th>
            <th scope="col">{{ $t("objects.create.plan.name") }}</th>
            <th scope="col">{{ $t("objects.create.plan.area") }}</th>
            <th scope="col">{{ $t("objects.create.plan.balcony") }}</th>
            <th scope="col">{{ $t("objects.create.plan.balcony_area") }}</th>
            <th scope="col" width="150" class="text-right">{{ $t("action") }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(plan, index) in plans" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ plan.name }}</td>
            <td>{{ plan.area }}</td>
            <td>{{ plan.balcony ? $t("yes") : $t("no") }}</td>
            <td>{{ plan.balcony_area }}</td>
            <td class="text-right">
                <b-button
                    v-if="!plan.deleted"
                    size="sm"
                    variant="danger"
                    @click="deletePlan(plan)"
                >
                    <i class="fas fa-trash"></i>
                </b-button>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: "TypePlanLIst",
    props: {
        plans: {},
    },
    methods: {
        deletePlan(plan) {
            this.$swal({
                title: this.$t("sweetAlert.title"),
                text: this.$t("sweetAlert.text"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: this.$t("cancel"),
                confirmButtonText: this.$t("sweetAlert.yes"),
            }).then((result) => {
                if (result.value) {
                    plan.name = "Удалено";
                    plan.area = 0;
                    plan.balcony = false;
                    plan.balcony_area = 0;
                    plan.deleted = true;
                }
            });
        },
    },
};
</script>

<style scoped></style>
