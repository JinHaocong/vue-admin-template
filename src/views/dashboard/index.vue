<!--
 * @Author: Jin Haocong
 * @Date: 2022-08-22 10:53:58
 * @LastEditTime: 2022-08-25 17:17:19
-->
<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="scss" scoped>

</style>
