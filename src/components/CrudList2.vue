<template>
  <v-card
    class="crud-list"
    :max-width="maxWidth"
    :class="{ 'mx-auto': mxAuto }"
  >
    <v-toolbar color="primary" dark flat class="crud-list__header">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleSearch">
        <v-icon>{{ search.dialog ? "mdi-close" : "mdi-magnify" }}</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-text-field
          solo
          flat
          autofocus
          hide-details
          v-if="search.dialog"
          v-model="search.keyword"
          class="crud-list__search"
          placeholder="Search..."
        />
        <v-btn
          fab
          right
          small
          bottom
          absolute
          v-if="!search.dialog"
          :color="create.dialog ? 'red' : 'pink'"
          @click="initCreate"
        >
          <v-icon small>{{ create.dialog ? "mdi-close" : "mdi-plus" }}</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <v-list
      class="bg-sec crud-list__list py-2"
      :style="{ maxHeight: listHeight }"
      :class="create.dialog ? 'pt-0' : 'pt-2'"
    >
      <transition-group name="list" v-if="isLoaded && items.length !== 0">
        <v-list-item
          class="crud-list__item"
          :two-line="twoLine"
          :key="item.id"
          :class="{ active: isItemActive(item.id) }"
          v-for="item in items"
        >
          <!-- Start List item content -->
          <v-list-item-content>
            <slot name="list-item-content" :item="item">
              <v-list-item-title v-text="item.name" />
            </slot>
          </v-list-item-content>
          <!-- End List item content -->

          <!-- Start update and delete action -->
          <span class="crud-list__actions">
            <v-btn
              icon
              small
              :loading="
                update.loading && update.data && update.data.id === item.id
              "
              @click="initUpdate(onInitUpdate ? onInitUpdate(item) : item)"
            >
              <v-icon size="18" color="success">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              small
              @click="initDelete(item.id)"
              :loading="deletee.loading"
            >
              <v-icon size="18" color="error">mdi-delete</v-icon>
            </v-btn>
          </span>
          <!-- End update and delete action -->
        </v-list-item>
      </transition-group>

      <!-- Start Skeleton loaders -->
      <template v-else>
        <v-skeleton-loader
          :key="i"
          v-for="i in 3"
          type="list-item"
          class="bg-sec"
        />
      </template>
      <!-- End Skeleton loaders -->

      <template v-if="search.dialog && items.length === 0">
        <v-card-text>No results found</v-card-text>
      </template>
    </v-list>

    <!-- Start Confirm delete action -->
    <Confirm
      v-model="deletee.dialog"
      :title="dialog.delete.title"
      :text="dialog.delete.subtitle"
      :loading="deletee.loading"
      @yes="handleDelete"
      @no="resetDelete"
    />
    <!-- End Confirm delete action -->

    <!-- Start Create update dialog -->
    <dialog-wrapper
      persistent
      v-bind="dialogAttrs"
      v-model="createUpdateDialogModel"
      :max-width="dialog.maxWidth"
      :loading="create.loading || update.loading"
    >
      <v-form
        lazy-validation
        ref="create-update-form"
        @submit.prevent="handleSubmit"
        v-model="create.isValid"
      >
        <slot
          name="create-update-fields"
          :data="create.dialog ? create.data : update.data"
        />
        <slot v-if="create.dialog" name="create-fields" :data="create.data" />
        <slot v-if="update.dialog" name="update-fields" :data="update.data" />
        <v-btn type="submit" class="d-none" />
      </v-form>
      <template #actions>
        <v-btn text @click="handleSubmit" color="primary">{{
          create.dialog ? "Create" : "Update"
        }}</v-btn>
        <v-btn text color="error" @click="onCloseResetForm">Cancel</v-btn>
      </template>
    </dialog-wrapper>
    <!-- End Create update dialog -->
  </v-card>
</template>

<script>
import CrudMixin from "@/mixins/crud-mixin";
import Confirm from "@/components/dialogs/Confirm";
import DialogWrapper from "@/components/dialogs/DialogWrapper2";

export default {
  name: "CrudList2",
  mixins: [CrudMixin],
  components: {
    Confirm,
    DialogWrapper,
  },
  props: {
    mxAuto: Boolean,
    isLoaded: Boolean,
    twoLine: Boolean,
    title: {
      type: String,
      default: "Crud List",
    },
    items: {
      type: Array,
      default: () => [],
    },
    maxWidth: {
      default: "600",
      type: [Number, String],
    },
    listHeight: {
      default: "100%",
      type: [String, Number],
    },
    dialog: {
      type: Object,
      default: () => ({
        maxWidth: "600",
        update: {
          title: "Update title",
          subtitle: "Update subtitle",
        },
        create: {
          title: "Create title",
          subtitle: "Create subtitle",
        },
        delete: {
          title: "Are you sure to delete?",
          subtitle: "Once you delete, this action can't be undone",
        },
      }),
    },

    // Callback functions
    onCreate: Function,
    onUpdate: Function,
    onDelete: Function,
    onInitUpdate: Function,
  },
  data() {
    return {
      newItem: {
        value: "",
        isValid: true,
      },
    };
  },
  computed: {
    createUpdateDialogModel: {
      get() {
        return this.create.dialog || this.update.dialog;
      },
      set(v) {
        this.create.dialog = v;
        this.update.dialog = v;
      },
    },
    dialogAttrs() {
      return {
        title: this.create.dialog
          ? this.dialog.create.title
          : this.dialog.update.title,
        subtitle: this.create.dialog
          ? this.dialog.create.subtitle
          : this.dialog.update.subtitle,
      };
    },
  },
  methods: {
    onCloseResetForm() {
      if (this.create.dialog) this.resetCreate();
      if (this.update.dialog) this.resetUpdate();
      //this.$refs["create-update-form"].reset();
    },
    async handleSubmit() {
      // Validating
      const form = this.$refs["create-update-form"];
      let isValid = form.validate();
      if (!isValid) return;

      let submit, data;

      if (this.create.dialog) {
        this.create.loading = true;
        submit = this.onCreate;
        data = { ...this.create.data };
      } else if (this.update.dialog) {
        this.update.loading = true;
        submit = this.onUpdate;
        data = { ...this.update.data };
      }

      if (!submit || !data) return;

      console.log(this.update, data);
      await submit(data);

      form.reset();
      this.create.dialog ? this.resetCreate() : this.resetUpdate();
    },
    async handleDelete() {
      this.deletee.loading = true;
      if (this.onDelete) {
        await this.onDelete(this.deletee.id);
        this.resetDelete();
      }
    },
    async handleUpdateSubmit() {
      const form = this.$refs.updateForm[0];
      let isValid = form.validate();
      if (!isValid) return;

      this.update.loading = true;
      if (this.onUpdate) {
        await this.onUpdate(this.update.data);
        this.resetUpdate();
      }
    },
    toggleSearch() {
      if (this.search.dialog) this.resetSearch();
      else this.search.dialog = true;
      if (this.create.dialog) this.resetCreate();
    },
    isItemActive(id) {
      const deleteId = this.deletee.id;
      const updateId = this.update.data && this.update.data.id;
      return deleteId === id || updateId === id;
    },
  },
};
</script>

<style lang='scss'>
.crud-list {
  &__header {
    z-index: 2;
  }
  .v-input__slot,
  .v-text-field__details,
  &__search .v-input__slot {
    margin: 0 !important;
    padding: 0 !important;
  }
  &__list .v-input__slot,
  &__search .v-input__slot {
    background-color: transparent !important;
  }
  &__list {
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(white, 0.08);
      &:hover {
        background-color: rgba(white, 0.16);
      }
    }
  }
  &__actions {
    button {
      opacity: 0 !important;
      visibility: hidden !important;
      transform: scale(0) !important;
      transition: all 300ms ease-in-out;
    }
  }
  &__item {
    transition: all 300ms ease-in-out;
    &.active,
    &:hover {
      background-color: rgba(black, 0.08);
      .crud-list__actions button {
        opacity: 1 !important;
        visibility: visible !important;
        transform: scale(1) !important;
      }
      .crud-list__actions button:last-child {
        transition-delay: 100ms;
      }
    }
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 500ms;
  }
  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  .v-skeleton-loader__list-item {
    background-color: transparent !important;
  }
}
</style>