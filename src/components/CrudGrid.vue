<template>
	<div class="crud-grid">
		<v-toolbar flat :extended="$vuetify.breakpoint.xsOnly">
			<v-toolbar-title>{{ title }}</v-toolbar-title>
			<v-spacer />
			<div>
				<v-text-field
					clearable
					placeholder="Search..."
					v-bind="fieldAttrs"
					class="w-25 mr-4"
					v-model="search.keyword"
					v-if="search.dialog && $vuetify.breakpoint.smAndUp"
				/>
			</div>
			<v-btn v-if="search.dialog" icon @click="resetSearch">
				<v-icon>mdi-close</v-icon>
			</v-btn>
			<v-btn v-else icon @click="initSearch">
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
			<template #extension v-if="$vuetify.breakpoint.xsOnly">
				<v-text-field
					clearable
					class="mr-md-4"
					placeholder="Search..."
					v-bind="fieldAttrs"
					v-model="search.keyword"
					v-if="search.dialog && $vuetify.breakpoint.xsOnly"
				/>
			</template>
		</v-toolbar>
		<div class="px-4" :class="{ 'mt-4': $vuetify.breakpoint.xsOnly }">
			<v-row>
				<v-col :sm="sm" :md="md" :lg="lg" :xl="xl" :cols="cols">
					<v-card
						:dark="dark"
						:outlined="outlined"
						:disabled="create.loading"
					>
						<CircleLoader
							center
							absolute
							size="64"
							speed="1"
							border-width="3"
							v-if="create.loading && isCreateInnerForm"
						/>
						<v-form
							ref="cu-form"
							lazy-validation
							v-if="isCreateInnerForm"
							:v-model="create.isValid"
							@submit.prevent="handleSubmit"
						>
							<v-card-text class="pb-2">
								<slot name="fields" :data="create.data" />
							</v-card-text>
							<v-card-actions class="px-4 pb-4 pt-0">
								<v-btn small depressed type="submit" color="primary"
									>Create</v-btn
								>
								<v-btn
									color="error"
									v-bind="textBtnAttrs"
									@click="resetCreate"
								>
									Cancel
								</v-btn>
							</v-card-actions>
						</v-form>
						<slot v-else name="create" :on="{ click: initCreate }" />
					</v-card>
				</v-col>
				<template v-for="(item, index) in filterredItems">
					<v-col
						:sm="sm"
						:md="md"
						:lg="lg"
						:xl="xl"
						:cols="cols"
						:key="index"
					>
						<v-card
							:dark="dark"
							:outlined="outlined"
							:disabled="update.loading"
						>
							<CircleLoader
								center
								absolute
								size="64"
								speed="1"
								border-width="3"
								v-if="update.loading && isUpdateInnerForm(item.id)"
							/>
							<v-form
								ref="cu-form"
								lazy-validation
								:v-model="update.isValid"
								v-if="isUpdateInnerForm(item.id)"
								@submit.prevent="handleSubmit"
							>
								<v-card-text class="pb-2">
									<slot name="fields" :data="update.data" />
								</v-card-text>
								<v-card-actions class="px-4 pb-4 pt-0">
									<v-btn small depressed type="submit" color="primary"
										>Update</v-btn
									>
									<v-btn
										color="error"
										v-bind="textBtnAttrs"
										@click="resetUpdate"
									>
										Cancel
									</v-btn>
								</v-card-actions>
							</v-form>
							<template v-else>
								<slot name="item" :item="item" />
								<v-menu bottom left transition="slide-x-transition">
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											top
											icon
											right
											absolute
											v-on="on"
											color="grey"
											class="lighten-4"
											v-bind="attrs"
										>
											<v-icon>mdi-dots-vertical</v-icon>
										</v-btn>
									</template>
									<v-list dense>
										<v-list-item
											@click="initUpdate(item)"
											class="pr-6"
										>
											<v-icon size="18">mdi-pencil</v-icon>
											<v-list-item-title class="ml-3">
												Update
											</v-list-item-title>
										</v-list-item>
										<v-list-item
											@click="initDelete(item.id)"
											class="pr-6"
										>
											<v-icon size="18">mdi-delete</v-icon>
											<v-list-item-title class="ml-3">
												Delete
											</v-list-item-title>
										</v-list-item>
									</v-list>
								</v-menu>
							</template>
						</v-card>
					</v-col>
				</template>
			</v-row>
		</div>
		<!-- Start Confirm delete action -->
		<confirm
			v-model="deletee.dialog"
			:title="dialog.delete.title"
			:text="dialog.delete.subtitle"
			:loading="deletee.loading"
			@yes="handleDelete"
			@no="resetDelete"
		>
			<template #loader>
				<CircleLoader
					center
					absolute
					size="64"
					speed="1"
					border-width="3"
				/>
			</template>
		</confirm>
		<!-- End Confirm delete action -->

		<!-- Start Create update dialog -->
		<dialog-wrapper
			persistent
			v-bind="dialogAttrs"
			v-if="cuType === 'dialog'"
			v-model="createUpdateDialogModel"
			:max-width="dialog.maxWidth"
			:loading="create.loading || update.loading"
		>
			<v-form
				lazy-validation
				ref="cu-form"
				@submit.prevent="handleSubmit"
				v-model="create.isValid"
			>
				<slot
					name="fields"
					:data="create.dialog ? create.data : update.data"
				/>
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
	</div>
</template>

<script>

// Mixins
import CrudMixin from '@/mixins/crud-mixin'
import FormMixin from '@/mixins/form-mixin'
// Components
import Confirm from "@/components/dialogs/Confirm";
import DialogWrapper from "@/components/dialogs/DialogWrapper";
import CircleLoader from "@/components/custom/CircleLoader";

// Export
export default {
	name: 'CrudGrid',
	mixins: [CrudMixin, FormMixin],
	components: {
		Confirm,
		CircleLoader,
		DialogWrapper
	},
	props: {

		// Booleans
		mxAuto: Boolean,
		isLoaded: Boolean,
		outlined: Boolean,
		dark: Boolean,

		// Callback functions
		onCreate: Function,
		onUpdate: Function,
		onDelete: Function,
		onFilter: Function,
		onInitUpdate: Function,

		title: {
			type: String,
			default: 'Crud Grid',
		},
		cols: {
			default: false,
			type: [Boolean, String, Number]
		},
		sm: {
			default: false,
			type: [Boolean, String, Number]
		},
		md: {
			default: false,
			type: [Boolean, String, Number]
		},
		lg: {
			default: false,
			type: [Boolean, String, Number]
		},
		xl: {
			default: false,
			type: [Boolean, String, Number]
		},
		items: {
			type: Array,
			default: () => ([])
		},
		cuType: {
			type: String,
			default: 'dialog',
			validator(type) {
				return [
					'inner',
					'dialog',
					'upper'
				].includes(type)
			}
		},
		maxWidth: {
			default: "600",
			type: [Number, String],
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
		filterredItems() {
			if (!this.search.keyword) return this.items
			return this.items.filter(
				item => this.onFilter(item, this.search.keyword)
			)
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
		isCUInnerForm() {
			return this.cuType === 'inner' &&
				(this.create.dialog || this.update.dialog)
		},
		isCreateInnerForm() {
			return this.cuType === 'inner' && this.create.dialog
		}
	},
	methods: {
		async handleSubmit() {

			// Validating
			const form = this.$refs["cu-form"];

			let isValid = Array.isArray(form)
				? form[0].validate()
				: form.validate();

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

			setTimeout(async () => {
				this.resetCreate()
				this.resetUpdate()

				if (!submit || !data) return;
				console.log(this.update, data);
				await submit(data);
				form.reset();
				this.create.dialog ? this.resetCreate() : this.resetUpdate();
			}, 2000);
		},
		async handleDelete() {
			this.deletee.loading = true;
			if (this.onDelete) {
				await this.onDelete(this.deletee.id);
				this.resetDelete();
			}
		},
		onCloseResetForm() {
			if (this.create.dialog) this.resetCreate();
			if (this.update.dialog) this.resetUpdate();
		},
		isUpdateInnerForm(id) {
			return this.cuType === 'inner' && (
				this.update.dialog &&
				this.update.data.id === id
			)
		}
	}
}
</script>

<style lang="scss" >
	.crud-grid {
		.v-text-field__details {
			margin-bottom: 0 !important;
			padding-left: 2px !important;
		}
		.v-text-field--outlined fieldset {
			border-color: #dadce0 !important;
		}
		.v-text-field--outlined.error--text fieldset {
			border-color: #ff5252 !important;
		}
		.v-text-field--outlined.primary--text fieldset {
			border-color: #1976d2 !important;
		}
		button:focus {
			outline: none;
		}
	}
</style>