<template>
	<div class="Lists">
		<crud-grid
			sm="6"
			md="4"
			outlined
			cols="12"
			cu-type="inner"
			:items="fruits"
			:onFilter="handleFilter"
		>
			<template #fields="{ data }">
				<v-text-field
					v-model="data.name"
					v-bind="fieldAttrs"
					hint="Press enter to add"
					placeholder="Type here"
					:rules="[(v) => !!v || 'Name is required']"
				/>
			</template>
			<template #create="{ on }">
				<div class="py-3 text-center">
					<v-btn depressed rounded class="transparent" large v-on="on">
						<v-icon left size="24" class="grey--text lighten-4"
							>mdi-plus-circle-outline</v-icon
						>
						<span>Add New</span>
					</v-btn>
				</div>
			</template>
			<template #item="{ item }">
				<v-card-title>{{ item.name }}</v-card-title>
			</template>
		</crud-grid>
	</div>
</template>

<script>
import CrudGrid from '@/components/CrudGrid'
import FormMixin from '@/mixins/form-mixin'
export default {
	name: 'Lists',
	mixins: [FormMixin],
	components: { CrudGrid },
	data() {
		return {
			searchKeyword: '',
			fruits: [
				{
					id: 1,
					name: 'Apple'
				},
				{
					id: 2,
					name: 'Banana'
				},
				{
					id: 3,
					name: 'Orange'
				}
			]
		}
	},
	methods: {
		handleFilter(item, key) {
			return item.name.toLowerCase().includes(
				key.toLowerCase()
			)
		}
	}
}
</script>

<style lang='scss' scoped>
	.Lists {
	}
</style>