<template>
  <v-card class="crud-list mx-auto" max-width="600">
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
          @click="create.dialog = !create.dialog"
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
      <v-list-item
        v-if="create.dialog"
        class="crud-list__create-item py-2 mb-0"
      >
        <v-form
          lazy-validation
          ref="createForm"
          v-model="newItem.isValid"
          :disabled="create.loading"
          @submit.prevent="handleSubmit"
          class="w-100"
        >
          <v-text-field
            solo
            flat
            autofocus
            name="create"
            hide-details="auto"
            v-model="newItem.value"
            placeholder="Type here..."
            hint="Please enter to add"
            :rules="[(v) => !!v || 'Can\'t leave empty']"
          />
          <!-- <button v-btn small type="submit" >Create</button> -->
          <v-btn type="submit" depressed class="mt-2" color="primary" small  >Create</v-btn>
        </v-form>
        <v-progress-circular
          :width="3"
          indeterminate
          color="accent"
          class="center"
          v-if="create.loading"
        ></v-progress-circular>
      </v-list-item>
      <v-subheader>LIST</v-subheader>
      <v-list-item-group v-if="isLoaded || items.length !== 0">
        <transition-group name="list">
          <v-list-item
            :key="item.id"
            v-for="item in filteredItems"
            class="crud-list__item"
            :class="{
              active:
                delet.id === item.id ||
                (update.data && update.data.id === item.id),
            }"
          >
            <v-list-item-content>
              <v-form
                lazy-validation
                ref="updateForm"
                v-model="update.isValid"
                :disabled="update.loading"
                @submit.prevent="handleUpdateSubmit"
                v-if="update.data && update.data.id === item.id"
              >
                <v-text-field
                  solo
                  flat
                  autofocus
                  name="update"
                  v-model="update.data.name"
                  placeholder="Type here..."
                  hint="Please enter to update"
                  :rules="[(v) => !!v || 'Can\'t leave empty']"
                />
              </v-form>
              <v-list-item-title v-else v-text="item.name"></v-list-item-title>
            </v-list-item-content>
            <span class="crud-list__actions">
              <v-btn
                icon
                small
                @click="resetUpdate"
                v-if="
                  !update.loading && update.data && update.data.id === item.id
                "
              >
                <v-icon size="18" color="error">mdi-close</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                :loading="
                  update.loading && update.data && update.data.id === item.id
                "
                @click="initUpdate(item)"
              >
                <v-icon size="18" color="success">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="initDelete(item.id)"
                :loading="delet.loading && delet.id === item.id"
              >
                <v-icon size="18" color="error">mdi-delete</v-icon>
              </v-btn>
            </span>
          </v-list-item>
        </transition-group>
      </v-list-item-group>

      <template v-else>
        <v-skeleton-loader
          :key="i"
          v-for="i in 3"
          type="list-item"
          class="bg-sec"
        />
      </template>
      <template v-if="search.dialog && filteredItems.length === 0">
        <v-card-text>No results found</v-card-text>
      </template>
    </v-list>
    <Confirm
      title="Are you sure to delete?"
      text="Once you delete, this action can't be undone"
      v-model="delet.dialog"
      :loading="delet.loading"
      @yes="handleDelete"
      @no="delet.id = null"
    />
  </v-card>
</template>

<script>
import CrudMixin from "@/mixins/CrudMixin";
export default {
  name: "CrudList",
  mixins: [CrudMixin],
  props: {
    isLoaded: Boolean,
    title: {
      type: String,
      default: "Crud List",
    },
    items: {
      type: Array,
      default: () => [],
    },
    listHeight: {
      default: "100%",
      type: [String, Number],
    },
    onAdd: Function,
    onDelete: Function,
    onUpdate: Function,
  },
  data() {
    return {
      newItem: {
        value: "",
        isValid: true,
      },
    };
  },
  created() {
    this.resetCrudMixin();
  },
  computed: {
    filteredItems() {
      if (!this.search.keyword) return this.items;
      return this.items.filter((item) => {
        return item.name
          .toLowerCase()
          .includes(this.search.keyword.toLowerCase());
      });
    },
  },
  methods: {
    async handleSubmit() {
      const form = this.$refs.createForm;
      let isValid = form.validate();
      if (!isValid) return;

      this.create.loading = true;
      if (this.onAdd) {
        await this.onAdd(this.newItem.value);
        this.create.loading = false;
        form.reset();
      }
    },
    async handleDelete() {
      this.delet.loading = true;
      if (this.onDelete) {
        await this.onDelete(this.delet.id);
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
  },
};
</script>

<style lang='scss'>
.theme--light {
  --crud-list-create-input-bg: #eeeeee;
}
.theme--dark {
  --crud-list-create-input-bg: rgb(40, 43, 48);
}
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
  &__create-item {
    z-index: 1;
    margin-bottom: 0.5rem;
    &,
    .v-input__slot {
      background-color: var(--crud-list-create-input-bg) !important;
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
    &.active,
    &:hover {
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