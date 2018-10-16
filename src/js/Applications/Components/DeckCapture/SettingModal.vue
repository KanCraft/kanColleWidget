<template>
  <div class="modal" :class="{active}" id="modal-id">
    <a href="#close" class="modal-overlay" aria-label="Close"></a>
    <div class="modal-container">
      <div class="modal-header">
        <a href="#close" class="btn btn-clear float-right" aria-label="Close"></a>
        <div class="modal-title h5">Modal title</div>
      </div>
      <div class="modal-body">
        <div class="content">
          <!-- content here -->
        </div>
      </div>
      <div class="modal-footer">
        ...
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from "vue-property-decorator";

@Component
export default class SettingModal extends Vue {
  @Prop() private active: boolean;
}
</script>

