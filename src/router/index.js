import Vue from 'vue'
import VueRouter from 'vue-router'
import { view } from '../helpers'

import Home from '@/views/Home'
import Default from '@/layouts/Default'

Vue.use(VueRouter)

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			component: Default,
			children: [
				{
					path: '',
					name: 'Home',
					component: Home
				},
				{
					path: 'lists',
					name: 'Lists',
					component: view('Lists')
				},
				{
					path: 'about',
					name: 'About',
					component: view('About')
				}
			]
		},
	]
})

export default router
