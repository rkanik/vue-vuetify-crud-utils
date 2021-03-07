<template>
	<v-app>
		<v-navigation-drawer app v-model="drawer">
			<v-list>
				<v-list-item-group>
					<v-list-item to="/">
						<v-list-item-title>Home</v-list-item-title>
					</v-list-item>
					<v-list-item to="/lists">
						<v-list-item-title>Lists</v-list-item-title>
					</v-list-item>
					<v-list-item to="/about">
						<v-list-item-title>About</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>
		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>Application</v-toolbar-title>
		</v-app-bar>
		<v-main>
			<router-wrapper>
				<router-view class="pa-3" />
			</router-wrapper>
		</v-main>
	</v-app>
</template>

<script>
import RouterWrapper from '@/components/custom/RouterWrapper'
export default {
	name: 'DefaultLayout',
	components: {
		RouterWrapper
	},
	data: () => ({
		drawer: null
	}),
}
</script>