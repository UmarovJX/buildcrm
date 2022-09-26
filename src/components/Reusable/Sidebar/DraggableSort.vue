<template>
    <div class="row">
        <div class="col-7">
            <draggable tag="ul" :list="list" class="list-group" handle=".handle">
                <li
                    class="list-group-item"
                    v-for="(element, idx) in list"
                    :key="element.name"
                >
                    <i class="fa fa-align-justify handle"></i>

                    <span class="text">{{ element.name }} </span>

                    <input type="text" class="form-control" v-model="element.text"/>

                    <i class="fa fa-times close" @click="removeAt(idx)"></i>
                </li>
            </draggable>

        </div>

    </div>
</template>

<script>
let id = 3;
import draggable from "vuedraggable";

export default {
    name: "DraggableSort",
    display: "Handle",
    instruction: "Drag using the handle icon",
    // order: 5,
    components: {
        draggable,
    },
    data() {
        return {
            list: [
                {name: "John", text: "", id: 0},
                {name: "Joao", text: "", id: 1},
                {name: "Jean", text: "", id: 2}
            ],
            dragging: false
        };
    },
    computed: {
        draggingInfo() {
            return this.dragging ? "under drag" : "";
        }
    },
    methods: {
        removeAt(idx) {
            this.list.splice(idx, 1);
        },
        add: function () {
            id++;
            this.list.push({name: "Juan " + id, id, text: ""});
        },
        log(event) {
            console.log(event, 'event drag sort');
        }
    }
};
</script>
<style scoped>
.button {
    margin-top: 35px;
}

.handle {
    float: left;
    padding-top: 8px;
    padding-bottom: 8px;
}

.close {
    float: right;
    padding-top: 8px;
    padding-bottom: 8px;
}

input {
    display: inline-block;
    width: 50%;
}

.text {
    margin: 20px;
}
</style>