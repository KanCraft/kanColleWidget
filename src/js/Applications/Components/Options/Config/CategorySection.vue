<!-- とくに相互依存が無くて表示ロジックが凝っていない設定カテゴリはこのコンポーネントを使ってください -->
<template>
  <section class="category">
    <h1>{{title}}</h1>
    <config v-for="c in configs" :key="c.title" :config="c" />
  </section>  
</template>
<script lang="ts">
import {Vue,Component,Prop} from "vue-property-decorator";
import Config from "../../../Models/Config";
import ConfigView from "./index.vue";
@Component({components: {"config": ConfigView}})
export default class CategorySection extends Vue {
  @Prop() private title: string;
  @Prop() private configs: Config<any>[];
}
</script>

