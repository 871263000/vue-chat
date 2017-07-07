<script>
import { mapState } from 'vuex';

export default {
    computed: mapState({
        user: ({ user }) => user,
        filterKey: ({ filterKey }) => filterKey
    }),
    methods: {
        onKeyup (e) {
            this.$store.dispatch('search', e.target.value);
        }
    }
};
</script>

<template>
<div class="card">
    <footer>
        <input class="search" type="text" placeholder="搜索" @keyup="onKeyup">
    </footer>
</div>
</template>

<style scoped lang="less">
.card {
    padding: 12px;

    footer {
        margin-top: 10px;
    }

    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }
    .search {

        padding: 0 10px;
        font-size: 12px;
        color: #000;
        height: 30px;
        line-height: 30px;
        border: solid 1px #3a3a3a;
        border-radius: 4px;
        outline: none;
        /*background-color: #26292E;*/
    }
}
</style>