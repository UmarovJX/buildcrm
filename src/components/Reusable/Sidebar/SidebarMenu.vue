<script>
export default {
  name: 'SidebarMenu',
  data() {
    return {
      sidebarLinks: [
        {
          leftIcon: '',
          rightIcon: '',
          routerLink: '',
          routeName: '',
          expand: false,
          hierarchy: 1,
          children: [
            {
              leftIcon: '',
              rightIcon: '',
              routerLink: '',
              routeName: '',
              hierarchy: 2,
            },
          ],
        },
      ],
    }
  },
}
</script>

<template>
  <div>
    <div
      v-for="(
        {
          leftIcon,
          rightIcon,
          routerLink,
          routeName,
          expand,
          hierarchy,
          children,
        },
        index
      ) in sidebarLinks"
      :key="routeName + index"
    >
      <span class="left-icon-wrapper">
        <slot :name="`leftIcon-${leftIcon}-${hierarchy}-${index}`" />
      </span>
      <span class="main-view-wrapper">
        {{ routeName }}
      </span>
      <span class="right-icon-wrapper" />
    </div>
  </div>
</template>
