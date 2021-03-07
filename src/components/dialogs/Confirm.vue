<template>
	<v-dialog persistent v-model="dialog" :width="width || 400">
		<v-card :disabled="loading">
			<v-card-title class="headline pb-1 font-weight-regular">{{
				title ? title : "Are you sure to continue?"
			}}</v-card-title>
			<v-card-text v-if="text" class="pb-2">{{ text }}</v-card-text>
			<v-card-actions class="pb-4 pt-0">
				<v-spacer></v-spacer>
				<v-btn color="red" text @click="$emit('input', false), $emit('no')"
					>NO</v-btn
				>
				<v-btn color="green darken-1" text @click="$emit('yes')">Yes</v-btn>
			</v-card-actions>
			<span v-if="loading">
				<slot name="loader">
					<v-progress-circular
						indeterminate
						color="accent"
						class="center"
					/>
				</slot>
			</span>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "Confirm",
	props: {
		text: String,
		title: String,
		value: Boolean,
		loading: {
			type: Boolean,
			default: false,
		},
		width: [Number, String],
	},
	computed: {
		dialog: {
			get() {
				return this.value;
			},
			set(v) {
				this.$emit("input", v);
			},
		},
	},
};
</script>
<style lang="scss" scoped>
	.center {
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
	}
</style>