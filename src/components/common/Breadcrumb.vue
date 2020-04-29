<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">
                <slot name="home"></slot>
            </el-breadcrumb-item>
            <el-breadcrumb-item > <slot name="Two"></slot></el-breadcrumb-item>
            <el-breadcrumb-item> <slot name="three"></slot></el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: "Breadcrumb"
    }
</script>

<style scoped>

</style>