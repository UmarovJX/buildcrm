<template>
    <div class="b-container">
        <div class="b-header">
            <h3>
                Бронирование
            </h3>
            <x-button
                v-if="false"
                variant="secondary"
                :text="$t('filter_names.all')"
                right-icon="arrow_forward"
                color-icon="var(--gray-400)"
            />
            <x-button
                v-else
                id="booked"
                variant="secondary"
                text="Добавить бронь в очереди"
                left-icon="add"
                color-icon="var(--violet-700)"
                :disabled="false"
            />
            <b-tooltip
                id="b-header__tooltip"
                class="button-tooltip"
                target="booked"
                title="Нельзя забронировать более 3 раз"/>
        </div>

        <div class="b-body">
            <booked-item/>
            <booked-item :footer="false"/>
            <booked-item/>
        </div>

    </div>
</template>

<script>
import {XButton} from "@/components/ui-components/button";
import BookedItem from "@/views/Objects/Apartments/View/BookedItem";


export default {
    name: "BookedBlock",
    components: {
        XButton,
        BookedItem
    },
}
</script>

<style lang="scss" scoped>
.b-container {
}

.b-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;

    h3 {
        font-family: CraftworkSans, serif;
        font-weight: 900;
        font-size: 24px;
        line-height: 28px;
        color: var(--gray-400);
        margin-bottom: 0;
    }
}

.b-body {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: flex-start;
    column-gap: 2rem;
    row-gap: 1.5rem;
}


#b-header__tooltip ::v-deep {
    .tooltip-inner {
        padding: 12px 16px;
        border-radius: 1rem;
        width: max-content;
        max-width: max-content;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: var(--gray-600);
        background: var(--gray-200);
        filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08));
    }

    .arrow::before {
        border-top-color: var(--gray-200) !important;
        filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08));
    }
}


</style>