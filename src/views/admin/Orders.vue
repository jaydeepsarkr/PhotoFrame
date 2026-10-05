<template>
  <div class="space-y-6">
    <!-- Top Master Tab Switcher (Orders vs Customers & Marketing vs Trash) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-200 dark:border-charcoal-800 pb-4">
      <div>
        <h1 class="text-2xl font-serif font-bold text-charcoal-900 dark:text-white">
          <template v-if="activeMainTab === 'trash'">Recently Deleted (Trash Bin)</template>
          <template v-else-if="activeMainTab === 'customers'">Customer Directory &amp; Email Marketing</template>
          <template v-else>Orders &amp; Fulfillment</template>
        </h1>
        <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65 mt-0.5">
          <template v-if="activeMainTab === 'trash'">
            View and manage soft-deleted orders and customer accounts. Restore them anytime or permanently erase them.
          </template>
          <template v-else-if="activeMainTab === 'customers'">
            View customer contact records, order history, bulk delete, and send personalized offers or promotional broadcast emails.
          </template>
          <template v-else>
            Track, filter, bulk manage, and update custom photo frame fulfillment statuses across the studio.
          </template>
        </p>
      </div>

      <!-- Tab Switch Buttons -->
      <div class="inline-flex p-1 rounded-2xl bg-cream-100 dark:bg-charcoal-800 border border-cream-200 dark:border-charcoal-700 shrink-0">
        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeMainTab === 'orders'
              ? 'bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white shadow-sm'
              : 'text-charcoal-800/70 dark:text-cream-200/70 hover:text-charcoal-900'
          ]"
          @click="switchMainTab('orders')"
        >
          <ShoppingBag class="w-3.5 h-3.5 text-gold-600" />
          <span>Orders ({{ allOrders.length }})</span>
        </button>

        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeMainTab === 'customers'
              ? 'bg-charcoal-900 dark:bg-gold-600 text-white shadow-sm'
              : 'text-charcoal-800/70 dark:text-cream-200/70 hover:text-charcoal-900'
          ]"
          @click="switchMainTab('customers')"
        >
          <Users class="w-3.5 h-3.5" />
          <span>Customers ({{ allCustomers.length }})</span>
        </button>

        <button
          type="button"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2',
            activeMainTab === 'trash'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-charcoal-800/70 dark:text-cream-200/70 hover:text-rose-600'
          ]"
          @click="switchMainTab('trash')"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Trash ({{ totalDeletedCount }})</span>
        </button>
      </div>
    </div>

    <!-- Notification Toast Banner -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="statusMessage"
        class="p-4 rounded-xl flex items-center justify-between border"
        :class="[
          statusType === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
        ]"
      >
        <div class="flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 text-rose-600 shrink-0" />
          <span>{{ statusMessage }}</span>
        </div>
        <button type="button" class="text-xs hover:opacity-75" @click="statusMessage = ''">✕</button>
      </div>
    </transition>

    <!-- ========================================== -->
    <!-- TAB 1: CUSTOMERS DIRECTORY & EMAIL SUITE -->
    <!-- ========================================== -->
    <div v-if="activeMainTab === 'customers'" class="space-y-6">
      <!-- Customer Metrics (4 Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
              Total Patrons
            </span>
            <div class="text-2xl font-serif font-bold text-charcoal-900 dark:text-white mt-1">
              {{ customerStats.total }}
            </div>
            <span class="text-[11px] text-charcoal-800/50 dark:text-cream-200/50">Active customer accounts</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-400 flex items-center justify-center">
            <Users class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
              Total Lifetime Spend
            </span>
            <div class="text-2xl font-serif font-bold text-gold-600 dark:text-gold-400 mt-1">
              {{ formatCurrency(customerStats.totalLtv) }}
            </div>
            <span class="text-[11px] text-emerald-600 font-semibold">Active customer revenue</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
            <TrendingUp class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
              Repeat Patrons
            </span>
            <div class="text-2xl font-serif font-bold text-purple-600 dark:text-purple-400 mt-1">
              {{ customerStats.repeatCustomers }}
            </div>
            <span class="text-[11px] text-charcoal-800/50 dark:text-cream-200/50">Placed &gt; 1 studio order</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
            <UserCheck class="w-5 h-5" />
          </div>
        </div>

        <div class="bg-gradient-to-br from-charcoal-900 to-charcoal-950 text-white rounded-2xl p-5 shadow-soft flex flex-col justify-between">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Marketing Campaign
            </span>
            <p class="text-xs text-cream-200/70 mt-1">
              Broadcast sales &amp; seasonal offers to all {{ allCustomers.length }} patrons instantly.
            </p>
          </div>
          <div class="mt-3">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-charcoal-950 text-xs font-bold transition-all shadow-sm"
              @click="openComposeModal('all')"
            >
              <Mail class="w-3.5 h-3.5" />
              <span>Broadcast to All Patrons</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative flex-1 max-w-md">
          <Search class="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
          <input
            v-model.trim="customerSearchQuery"
            type="text"
            placeholder="Search patron by name, email, phone, city..."
            class="w-full pl-10 pr-3.5 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold-600"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal-900 dark:bg-gold-600 hover:bg-gold-600 dark:hover:bg-gold-500 text-white text-xs font-semibold transition-all shadow-sm"
            @click="openComposeModal('all')"
          >
            <Send class="w-3.5 h-3.5 text-gold-300 dark:text-white" />
            <span>Send Email to All Customers</span>
          </button>
        </div>
      </div>

      <!-- Bulk Customer Action Bar (Fixed at bottom-right) -->
      <transition
        enter-active-class="transition-all duration-300 ease-out transform"
        enter-from-class="opacity-0 translate-y-10 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-250 ease-in transform"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-10 scale-95"
      >
        <div
          v-if="selectedCustomerIds.length > 0"
          class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
        >
          <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
            <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
              {{ selectedCustomerIds.length }}
            </span>
            <span class="text-cream-100 font-medium">{{ selectedCustomerIds.length === 1 ? 'customer selected' : 'customers selected' }}</span>
          </div>

          <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              @click="selectedCustomerIds = []"
            >
              Deselect
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              @click="handleBulkDeleteCustomers"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Move to Trash ({{ selectedCustomerIds.length }})</span>
            </button>
          </div>
        </div>
      </transition>

      <!-- Customers Directory Table -->
      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 shadow-soft overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-cream-50 dark:bg-charcoal-900 border-b border-cream-200 dark:border-charcoal-700 text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
                <th class="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    :checked="isAllCustomersSelected"
                    class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                    @change="toggleSelectAllCustomers"
                  />
                </th>
                <th class="py-3.5 px-4">Customer Name</th>
                <th class="py-3.5 px-4">Contact Info</th>
                <th class="py-3.5 px-4">Location</th>
                <th class="py-3.5 px-4 text-center">Orders</th>
                <th class="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th class="py-3.5 px-4">Latest Order</th>
                <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-cream-100 dark:divide-charcoal-700/50 text-sm">
              <tr
                v-for="customer in filteredCustomers"
                :key="customer.id || customer.email"
                :class="[
                  'transition-colors',
                  selectedCustomerIds.includes(customer.id)
                    ? 'bg-gold-50/40 dark:bg-gold-950/20'
                    : 'hover:bg-cream-50/50 dark:hover:bg-charcoal-700/30'
                ]"
              >
                <!-- Checkbox -->
                <td class="py-4 px-4 text-center">
                  <input
                    v-model="selectedCustomerIds"
                    type="checkbox"
                    :value="customer.id"
                    class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                  />
                </td>

                <!-- Name & Initial Avatar -->
                <td class="py-4 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-gold-400 font-bold text-xs flex items-center justify-center shrink-0 border border-gold-500/20 shadow-xs">
                      {{ getInitials(customer.fullName) }}
                    </div>
                    <div>
                      <div class="font-semibold text-charcoal-900 dark:text-white">
                        {{ customer.fullName }}
                      </div>
                      <span
                        v-if="customer.totalOrders > 1"
                        class="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold-50 text-gold-700 dark:bg-gold-950/60 dark:text-gold-300 border border-gold-200 dark:border-gold-800"
                      >
                        VIP Patron
                      </span>
                    </div>
                  </div>
                </td>

                <!-- Contact Info -->
                <td class="py-4 px-4">
                  <div class="space-y-0.5">
                    <a
                      :href="`mailto:${customer.email}`"
                      class="text-charcoal-900 dark:text-cream-100 hover:text-gold-600 font-mono text-[11px] block transition-colors"
                    >
                      {{ customer.email }}
                    </a>
                    <span v-if="customer.phone" class="text-charcoal-800/60 dark:text-cream-200/60 text-[11px] flex items-center gap-1">
                      <Phone class="w-3 h-3 text-gold-600" />
                      {{ customer.phone }}
                    </span>
                  </div>
                </td>

                <!-- Location -->
                <td class="py-4 px-4 text-charcoal-800/80 dark:text-cream-200/80 text-xs">
                  <div v-if="customer.city || customer.state" class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-gold-600 shrink-0" />
                    <span>{{ [customer.city, customer.state].filter(Boolean).join(', ') }}</span>
                  </div>
                  <span v-else class="text-charcoal-800/40 dark:text-cream-200/40">India</span>
                </td>

                <!-- Orders Count -->
                <td class="py-4 px-4 text-center">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-cream-100 dark:bg-charcoal-700 text-charcoal-900 dark:text-cream-100">
                    {{ customer.totalOrders }} {{ customer.totalOrders === 1 ? 'order' : 'orders' }}
                  </span>
                </td>

                <!-- Lifetime Value -->
                <td class="py-4 px-4 text-right font-serif font-bold text-charcoal-900 dark:text-white">
                  {{ formatCurrency(customer.totalSpent) }}
                </td>

                <!-- Latest Order Date -->
                <td class="py-4 px-4 text-charcoal-800/70 dark:text-cream-200/70 text-[11px]">
                  {{ formatDate(customer.lastOrderDate) }}
                </td>

                <!-- Actions Column -->
                <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gold-50 dark:bg-gold-950/40 hover:bg-gold-100 dark:hover:bg-gold-900/60 text-gold-800 dark:text-gold-300 border border-gold-200 dark:border-gold-800 text-xs font-semibold transition-colors"
                      title="Send email or special offer to this customer"
                      @click="openComposeModal('single', customer)"
                    >
                      <Mail class="w-3.5 h-3.5" />
                      <span>Offer</span>
                    </button>

                    <button
                      type="button"
                      class="p-1.5 rounded-xl hover:bg-cream-100 dark:hover:bg-charcoal-700 text-charcoal-600 dark:text-cream-300 transition-colors"
                      title="View orders by this customer"
                      @click="filterOrdersByCustomer(customer)"
                    >
                      <ExternalLink class="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      class="p-1.5 rounded-xl text-charcoal-600 dark:text-cream-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Move customer to Trash"
                      @click="handleDeleteCustomer(customer)"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredCustomers.length === 0">
                <td colspan="8" class="py-12 text-center text-charcoal-800/60 dark:text-cream-200/60">
                  <Users class="w-8 h-8 text-gold-500/50 mx-auto mb-2" />
                  <p class="font-medium text-sm">No customers matching your search query.</p>
                  <p class="text-xs text-charcoal-800/40 mt-1">Try searching by a different name, phone, or email.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- TAB 2: REGULAR ORDERS & FULFILLMENT -->
    <!-- ========================================== -->
    <div v-else-if="activeMainTab === 'orders'" class="space-y-6">
      <!-- Top Filter & Search Bar -->
      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-serif font-bold text-charcoal-900 dark:text-white">
              Studio Orders ({{ filteredOrders.length }})
            </h2>
            <p class="text-xs text-charcoal-800/65 dark:text-cream-200/65">
              Track and update custom photo frame fulfillment statuses
            </p>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model.trim="searchQuery"
              type="text"
              placeholder="Search Order ID, customer, phone..."
              class="px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-xs text-charcoal-900 dark:text-white focus:outline-none focus:border-gold-600 w-full sm:w-64"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="text-xs text-gold-600 hover:underline shrink-0"
              @click="searchQuery = ''"
            >
              Clear
            </button>
          </div>
        </div>

        <!-- Status Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            v-for="tab in filterTabs"
            :key="tab"
            type="button"
            :class="[
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
              activeFilter === tab
                ? 'bg-charcoal-900 dark:bg-gold-600 text-white shadow-sm'
                : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-charcoal-600'
            ]"
            @click="activeFilter = tab"
          >
            {{ tab }}
            <span class="ml-1 opacity-70">({{ getStatusCount(tab) }})</span>
          </button>
        </div>
      </div>

      <!-- Orders Table with Bulk Selection & Actions -->
      <OrderTable
        :orders="filteredOrders"
        :show-phone="true"
        :is-trash-mode="false"
        @delete-order="handleDeleteOrder"
        @bulk-delete="handleBulkDeleteOrders"
      />
    </div>

    <!-- ========================================== -->
    <!-- TAB 3: RECENTLY DELETED (TRASH / RECYCLE BIN) -->
    <!-- ========================================== -->
    <div v-else-if="activeMainTab === 'trash'" class="space-y-6">
      <!-- Trash Sub-Tabs Switcher & Master Empty Action -->
      <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap',
              activeTrashSubTab === 'orders'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 hover:bg-cream-200'
            ]"
            @click="activeTrashSubTab = 'orders'"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span>Deleted Orders ({{ deletedOrders.length }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap',
              activeTrashSubTab === 'customers'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 hover:bg-cream-200'
            ]"
            @click="activeTrashSubTab = 'customers'"
          >
            <Users class="w-3.5 h-3.5" />
            <span>Deleted Customers ({{ deletedCustomers.length }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap',
              activeTrashSubTab === 'frames'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 hover:bg-cream-200'
            ]"
            @click="activeTrashSubTab = 'frames'"
          >
            <Frame class="w-3.5 h-3.5" />
            <span>Deleted Frames ({{ deletedFrames.length }})</span>
          </button>

          <button
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap',
              activeTrashSubTab === 'designs'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 hover:bg-cream-200'
            ]"
            @click="activeTrashSubTab = 'designs'"
          >
            <Palette class="w-3.5 h-3.5" />
            <span>Deleted Designs ({{ deletedDesigns.length }})</span>
          </button>
        </div>

        <!-- Empty Trash Action -->
        <button
          v-if="currentTrashHasItems"
          type="button"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-semibold transition-colors shrink-0"
          @click="handleEmptyCurrentTrash"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Empty {{ currentTrashTabLabel }}</span>
        </button>
      </div>

      <!-- DELETED ORDERS SUB-TAB -->
      <div v-if="activeTrashSubTab === 'orders'" class="space-y-4">
        <OrderTable
          :orders="deletedOrders"
          :show-phone="true"
          :is-trash-mode="true"
          @restore-order="handleRestoreOrder"
          @bulk-restore="handleBulkRestoreOrders"
          @permanent-delete-order="handlePermanentDeleteOrder"
          @bulk-permanent-delete="handleBulkPermanentDeleteOrders"
        />
      </div>

      <!-- DELETED CUSTOMERS SUB-TAB -->
      <div v-else-if="activeTrashSubTab === 'customers'" class="space-y-4">
        <!-- Floating Bulk Action Ribbon for Deleted Customers (Fixed at bottom-right) -->
        <transition
          enter-active-class="transition-all duration-300 ease-out transform"
          enter-from-class="opacity-0 translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in transform"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-10 scale-95"
        >
          <div
            v-if="selectedDeletedCustomerIds.length > 0"
            class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
          >
            <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
              <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
                {{ selectedDeletedCustomerIds.length }}
              </span>
              <span class="text-cream-100 font-medium">{{ selectedDeletedCustomerIds.length === 1 ? 'deleted customer selected' : 'deleted customers selected' }}</span>
            </div>

            <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="selectedDeletedCustomerIds = []"
              >
                Deselect
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkRestoreCustomers(selectedDeletedCustomerIds)"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore ({{ selectedDeletedCustomerIds.length }})</span>
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkPermanentDeleteCustomers(selectedDeletedCustomerIds)"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Deleted Customers Table -->
        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 shadow-soft overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-cream-50 dark:bg-charcoal-900 border-b border-cream-200 dark:border-charcoal-700 text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
                  <th class="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllDeletedCustomersSelected"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                      @change="toggleSelectAllDeletedCustomers"
                    />
                  </th>
                  <th class="py-3.5 px-4">Customer Name</th>
                  <th class="py-3.5 px-4">Contact Info</th>
                  <th class="py-3.5 px-4">Location</th>
                  <th class="py-3.5 px-4 text-center">Orders</th>
                  <th class="py-3.5 px-4 text-right">Lifetime Spend</th>
                  <th class="py-3.5 px-4">Deleted When</th>
                  <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-100 dark:divide-charcoal-700/50 text-sm">
                <tr
                  v-for="customer in deletedCustomers"
                  :key="customer.id"
                  :class="[
                    'transition-colors',
                    selectedDeletedCustomerIds.includes(customer.id)
                      ? 'bg-gold-50/40 dark:bg-gold-950/20'
                      : 'hover:bg-cream-50/50 dark:hover:bg-charcoal-700/30'
                  ]"
                >
                  <!-- Checkbox -->
                  <td class="py-4 px-4 text-center">
                    <input
                      v-model="selectedDeletedCustomerIds"
                      type="checkbox"
                      :value="customer.id"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                    />
                  </td>

                  <!-- Name -->
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 rounded-xl bg-charcoal-700 text-cream-200 font-bold text-xs flex items-center justify-center shrink-0">
                        {{ getInitials(customer.fullName) }}
                      </div>
                      <div>
                        <div class="font-semibold text-charcoal-900 dark:text-white line-through opacity-80">
                          {{ customer.fullName }}
                        </div>
                        <span class="text-[10px] text-rose-500 font-medium">In Trash Bin</span>
                      </div>
                    </div>
                  </td>

                  <!-- Contact Info -->
                  <td class="py-4 px-4">
                    <div class="space-y-0.5">
                      <span class="font-mono text-[11px] text-charcoal-800/80 dark:text-cream-200/80 block">
                        {{ customer.email }}
                      </span>
                      <span v-if="customer.phone" class="text-charcoal-800/50 dark:text-cream-200/50 text-[11px]">
                        {{ customer.phone }}
                      </span>
                    </div>
                  </td>

                  <!-- Location -->
                  <td class="py-4 px-4 text-charcoal-800/80 dark:text-cream-200/80 text-xs">
                    {{ [customer.city, customer.state].filter(Boolean).join(', ') || 'India' }}
                  </td>

                  <!-- Orders Count -->
                  <td class="py-4 px-4 text-center text-xs font-semibold">
                    {{ customer.totalOrders || 0 }}
                  </td>

                  <!-- Lifetime Spend -->
                  <td class="py-4 px-4 text-right font-serif font-bold text-charcoal-900 dark:text-white">
                    {{ formatCurrency(customer.totalSpent || 0) }}
                  </td>

                  <!-- Deleted Date -->
                  <td class="py-4 px-4 text-xs text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                    {{ formatDate(customer.deletedAt || customer.updatedAt) }}
                  </td>

                  <!-- Actions Column -->
                  <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors"
                        title="Restore customer account"
                        @click="handleRestoreCustomer(customer)"
                      >
                        <RotateCcw class="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        class="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Permanently Delete customer"
                        @click="handlePermanentDeleteCustomer(customer)"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="deletedCustomers.length === 0">
                  <td colspan="8" class="py-12 text-center text-charcoal-800/60 dark:text-cream-200/60">
                    <Trash2 class="w-8 h-8 text-charcoal-400 mb-2 mx-auto opacity-50" />
                    <p class="font-medium text-sm">Trash bin is empty. No deleted customers.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- DELETED FRAMES SUB-TAB -->
      <div v-else-if="activeTrashSubTab === 'frames'" class="space-y-4">
        <!-- Floating Bulk Action Ribbon for Deleted Frames (Fixed at bottom-right) -->
        <transition
          enter-active-class="transition-all duration-300 ease-out transform"
          enter-from-class="opacity-0 translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in transform"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-10 scale-95"
        >
          <div
            v-if="selectedDeletedFrameIds.length > 0"
            class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
          >
            <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
              <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
                {{ selectedDeletedFrameIds.length }}
              </span>
              <span class="text-cream-100 font-medium">{{ selectedDeletedFrameIds.length === 1 ? 'deleted frame selected' : 'deleted frames selected' }}</span>
            </div>

            <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="selectedDeletedFrameIds = []"
              >
                Deselect
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkRestoreFrames(selectedDeletedFrameIds)"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore ({{ selectedDeletedFrameIds.length }})</span>
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkPermanentDeleteFrames(selectedDeletedFrameIds)"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Deleted Frames Table -->
        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 shadow-soft overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-cream-50 dark:bg-charcoal-900 border-b border-cream-200 dark:border-charcoal-700 text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
                  <th class="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllDeletedFramesSelected"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                      @change="toggleSelectAllDeletedFrames"
                    />
                  </th>
                  <th class="py-3.5 px-4">Frame</th>
                  <th class="py-3.5 px-4">Material</th>
                  <th class="py-3.5 px-4">Sizes</th>
                  <th class="py-3.5 px-4">Price</th>
                  <th class="py-3.5 px-4">Deleted When</th>
                  <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-100 dark:divide-charcoal-700/50 text-sm">
                <tr
                  v-for="frame in deletedFrames"
                  :key="frame.id"
                  :class="[
                    'transition-colors',
                    selectedDeletedFrameIds.includes(frame.id)
                      ? 'bg-gold-50/40 dark:bg-gold-950/20'
                      : 'hover:bg-cream-50/50 dark:hover:bg-charcoal-700/30'
                  ]"
                >
                  <!-- Checkbox -->
                  <td class="py-4 px-4 text-center">
                    <input
                      v-model="selectedDeletedFrameIds"
                      type="checkbox"
                      :value="frame.id"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                    />
                  </td>

                  <!-- Image & Name -->
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="frame.image"
                        :alt="frame.name"
                        class="w-12 h-12 rounded-xl object-cover border border-cream-300 dark:border-charcoal-600 opacity-80 shrink-0"
                      />
                      <div>
                        <div class="font-serif font-semibold text-charcoal-900 dark:text-white line-through opacity-80">
                          {{ frame.name }}
                        </div>
                        <span class="text-[10px] text-rose-500 font-medium">In Trash Bin</span>
                      </div>
                    </div>
                  </td>

                  <!-- Material -->
                  <td class="py-4 px-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-cream-100 dark:bg-charcoal-700 text-charcoal-800 dark:text-cream-200 border border-cream-300 dark:border-charcoal-600">
                      {{ frame.material }}
                    </span>
                  </td>

                  <!-- Sizes -->
                  <td class="py-4 px-4">
                    <div class="flex flex-wrap gap-1 max-w-xs">
                      <span
                        v-for="size in frame.sizes"
                        :key="size"
                        class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-cream-50 dark:bg-charcoal-900 border border-cream-300 dark:border-charcoal-700 text-charcoal-800 dark:text-cream-300"
                      >
                        {{ formatSizeLabel(size) }}
                      </span>
                    </div>
                  </td>

                  <!-- Price -->
                  <td class="py-4 px-4 font-bold text-charcoal-900 dark:text-white whitespace-nowrap">
                    {{ formatCurrency(frame.discountPrice || frame.price) }}
                  </td>

                  <!-- Deleted Date -->
                  <td class="py-4 px-4 text-xs text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                    {{ formatDate(frame.deletedAt || frame.updatedAt) }}
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors"
                        title="Restore frame to active inventory"
                        @click="handleRestoreFrame(frame)"
                      >
                        <RotateCcw class="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        class="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Permanently Delete frame"
                        @click="handlePermanentDeleteFrame(frame)"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="deletedFrames.length === 0">
                  <td colspan="7" class="py-12 text-center text-charcoal-800/60 dark:text-cream-200/60">
                    <Trash2 class="w-8 h-8 text-charcoal-400 mb-2 mx-auto opacity-50" />
                    <p class="font-medium text-sm">Trash bin is empty. No deleted frames.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- DELETED DESIGNS SUB-TAB -->
      <div v-else-if="activeTrashSubTab === 'designs'" class="space-y-4">
        <!-- Floating Bulk Action Ribbon for Deleted Designs (Fixed at bottom-right) -->
        <transition
          enter-active-class="transition-all duration-300 ease-out transform"
          enter-from-class="opacity-0 translate-y-10 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in transform"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-10 scale-95"
        >
          <div
            v-if="selectedDeletedDesignIds.length > 0"
            class="fixed bottom-6 right-6 z-50 p-2.5 sm:p-3 px-4 sm:px-5 rounded-2xl bg-charcoal-900/95 dark:bg-charcoal-900/95 backdrop-blur-md text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] border border-charcoal-700/80 flex items-center gap-3.5 max-w-[calc(100vw-3rem)]"
          >
            <div class="flex items-center gap-2.5 text-xs font-semibold whitespace-nowrap">
              <span class="w-6 h-6 rounded-lg bg-gold-600/30 text-gold-400 flex items-center justify-center text-xs font-mono font-bold">
                {{ selectedDeletedDesignIds.length }}
              </span>
              <span class="text-cream-100 font-medium">{{ selectedDeletedDesignIds.length === 1 ? 'deleted design selected' : 'deleted designs selected' }}</span>
            </div>

            <div class="h-4 w-px bg-charcoal-700 mx-0.5"></div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="px-3 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-cream-200 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="selectedDeletedDesignIds = []"
              >
                Deselect
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkRestoreDesigns(selectedDeletedDesignIds)"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span>Restore ({{ selectedDeletedDesignIds.length }})</span>
              </button>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-md hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                @click="handleBulkPermanentDeleteDesigns(selectedDeletedDesignIds)"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </transition>

        <!-- Deleted Designs Table -->
        <div class="bg-white dark:bg-charcoal-800 rounded-2xl border border-cream-200 dark:border-charcoal-700 shadow-soft overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-cream-50 dark:bg-charcoal-900 border-b border-cream-200 dark:border-charcoal-700 text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 dark:text-cream-200/60">
                  <th class="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllDeletedDesignsSelected"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                      @change="toggleSelectAllDeletedDesigns"
                    />
                  </th>
                  <th class="py-3.5 px-4">Preview</th>
                  <th class="py-3.5 px-4">Name</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Description</th>
                  <th class="py-3.5 px-4">Deleted When</th>
                  <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cream-100 dark:divide-charcoal-700/50 text-sm">
                <tr
                  v-for="design in deletedDesigns"
                  :key="design.id"
                  :class="[
                    'transition-colors',
                    selectedDeletedDesignIds.includes(design.id)
                      ? 'bg-gold-50/40 dark:bg-gold-950/20'
                      : 'hover:bg-cream-50/50 dark:hover:bg-charcoal-700/30'
                  ]"
                >
                  <!-- Checkbox -->
                  <td class="py-4 px-4 text-center">
                    <input
                      v-model="selectedDeletedDesignIds"
                      type="checkbox"
                      :value="design.id"
                      class="w-4 h-4 rounded text-gold-600 border-cream-300 dark:border-charcoal-600 focus:ring-gold-500 cursor-pointer"
                    />
                  </td>

                  <!-- Preview -->
                  <td class="py-4 px-4">
                    <img
                      :src="design.image"
                      :alt="design.name"
                      class="w-12 h-12 rounded-xl object-cover border border-cream-300 dark:border-charcoal-600 opacity-80 shrink-0"
                    />
                  </td>

                  <!-- Name -->
                  <td class="py-4 px-4">
                    <div class="font-serif font-semibold text-charcoal-900 dark:text-white line-through opacity-80">
                      {{ design.name }}
                    </div>
                    <span class="text-[10px] text-rose-500 font-medium">In Trash Bin</span>
                  </td>

                  <!-- Category -->
                  <td class="py-4 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gold-50 dark:bg-gold-950/40 text-gold-800 dark:text-gold-300 border border-gold-200 dark:border-gold-800">
                      {{ design.category }}
                    </span>
                  </td>

                  <!-- Description -->
                  <td class="py-4 px-4 text-xs text-charcoal-800/75 dark:text-cream-200/75 max-w-sm">
                    {{ design.description }}
                  </td>

                  <!-- Deleted Date -->
                  <td class="py-4 px-4 text-xs text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap">
                    {{ formatDate(design.deletedAt || design.updatedAt) }}
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div class="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors"
                        title="Restore design template"
                        @click="handleRestoreDesign(design)"
                      >
                        <RotateCcw class="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>

                      <button
                        type="button"
                        class="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Permanently Delete design"
                        @click="handlePermanentDeleteDesign(design)"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="deletedDesigns.length === 0">
                  <td colspan="7" class="py-12 text-center text-charcoal-800/60 dark:text-cream-200/60">
                    <Trash2 class="w-8 h-8 text-charcoal-400 mb-2 mx-auto opacity-50" />
                    <p class="font-medium text-sm">Trash bin is empty. No deleted design templates.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Compose Customer Email Modal -->
    <ComposeEmailModal
      :is-open="composeModalOpen"
      :initial-target="composeTarget"
      :initial-customer="selectedCustomer"
      @close="composeModalOpen = false"
      @sent="onEmailSent"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  ShoppingBag,
  Users,
  Search,
  Phone,
  MapPin,
  TrendingUp,
  UserCheck,
  Mail,
  Send,
  ExternalLink,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Frame,
  Palette
} from 'lucide-vue-next'
import OrderTable from '@/components/admin/OrderTable.vue'
import ComposeEmailModal from '@/components/admin/ComposeEmailModal.vue'
import { formatCurrency, formatDate, formatSizeLabel } from '@/utils/formatters'

export default {
  name: 'AdminOrdersView',
  components: {
    ShoppingBag,
    Users,
    Search,
    Phone,
    MapPin,
    TrendingUp,
    UserCheck,
    Mail,
    Send,
    ExternalLink,
    Trash2,
    RotateCcw,
    CheckCircle2,
    AlertCircle,
    Frame,
    Palette,
    OrderTable,
    ComposeEmailModal
  },
  data() {
    return {
      activeMainTab: 'orders', // 'orders' | 'customers' | 'trash'
      activeTrashSubTab: 'orders', // 'orders' | 'customers'
      activeFilter: 'All',
      searchQuery: '',
      customerSearchQuery: '',
      statusMessage: '',
      statusType: 'success',
      filterTabs: [
        'All',
        'New',
        'Confirmed',
        'Processing',
        'Ready',
        'Shipped',
        'Delivered',
        'Cancelled'
      ],
      // Selection states for customers
      selectedCustomerIds: [],
      selectedDeletedCustomerIds: [],
      selectedDeletedFrameIds: [],
      selectedDeletedDesignIds: [],
      // Modal state
      composeModalOpen: false,
      composeTarget: 'single', // 'single' | 'all'
      selectedCustomer: null
    }
  },
  computed: {
    ...mapGetters('orders', ['allOrders', 'deletedOrders']),
    ...mapGetters('customers', ['allCustomers', 'customerStats', 'deletedCustomers']),
    ...mapGetters('frames', ['deletedFrames']),
    ...mapGetters('designs', ['deletedDesigns']),

    totalDeletedCount() {
      return (
        (this.deletedOrders?.length || 0) +
        (this.deletedCustomers?.length || 0) +
        (this.deletedFrames?.length || 0) +
        (this.deletedDesigns?.length || 0)
      )
    },

    filteredOrders() {
      let list = [...this.allOrders]
      if (this.activeFilter !== 'All') {
        list = list.filter(o => o.status === this.activeFilter)
      }
      const q = this.searchQuery.toLowerCase()
      if (q) {
        list = list.filter(
          o =>
            String(o.id).toLowerCase().includes(q) ||
            String(o.customer?.fullName || '').toLowerCase().includes(q) ||
            String(o.customer?.phone || '').toLowerCase().includes(q) ||
            String(o.customer?.email || '').toLowerCase().includes(q) ||
            String(o.product?.frameName || '').toLowerCase().includes(q)
        )
      }
      return list
    },

    filteredCustomers() {
      let list = [...this.allCustomers]
      const q = this.customerSearchQuery.toLowerCase()
      if (q) {
        list = list.filter(
          c =>
            String(c.fullName || '').toLowerCase().includes(q) ||
            String(c.email || '').toLowerCase().includes(q) ||
            String(c.phone || '').toLowerCase().includes(q) ||
            String(c.city || '').toLowerCase().includes(q) ||
            String(c.state || '').toLowerCase().includes(q)
        )
      }
      return list
    },

    isAllCustomersSelected() {
      if (!this.filteredCustomers.length) return false
      return this.filteredCustomers.every(c => this.selectedCustomerIds.includes(c.id))
    },

    isAllDeletedCustomersSelected() {
      if (!this.deletedCustomers.length) return false
      return this.deletedCustomers.every(c => this.selectedDeletedCustomerIds.includes(c.id))
    },

    isAllDeletedFramesSelected() {
      if (!this.deletedFrames?.length) return false
      return this.deletedFrames.every(f => this.selectedDeletedFrameIds.includes(f.id))
    },

    isAllDeletedDesignsSelected() {
      if (!this.deletedDesigns?.length) return false
      return this.deletedDesigns.every(d => this.selectedDeletedDesignIds.includes(d.id))
    },

    currentTrashHasItems() {
      if (this.activeTrashSubTab === 'orders') return (this.deletedOrders?.length || 0) > 0
      if (this.activeTrashSubTab === 'customers') return (this.deletedCustomers?.length || 0) > 0
      if (this.activeTrashSubTab === 'frames') return (this.deletedFrames?.length || 0) > 0
      if (this.activeTrashSubTab === 'designs') return (this.deletedDesigns?.length || 0) > 0
      return false
    },

    currentTrashTabLabel() {
      if (this.activeTrashSubTab === 'orders') return 'Deleted Orders'
      if (this.activeTrashSubTab === 'customers') return 'Deleted Customers'
      if (this.activeTrashSubTab === 'frames') return 'Deleted Frames'
      if (this.activeTrashSubTab === 'designs') return 'Deleted Designs'
      return 'Trash'
    }
  },
  watch: {
    '$route.query.tab': {
      immediate: true,
      handler(tab) {
        if (tab === 'customers') {
          this.activeMainTab = 'customers'
        } else if (tab === 'trash') {
          this.activeMainTab = 'trash'
          if (this.$route.query.subtab) {
            this.activeTrashSubTab = this.$route.query.subtab
          }
        } else {
          this.activeMainTab = 'orders'
        }
      }
    }
  },
  mounted() {
    this.fetchOrders()
    this.fetchDeletedOrders()
    this.fetchCustomers()
    this.fetchDeletedCustomers()
    this.fetchDeletedFrames()
    this.fetchDeletedDesigns()
  },
  methods: {
    formatCurrency,
    formatDate,
    formatSizeLabel,
    ...mapActions('orders', [
      'fetchOrders',
      'fetchDeletedOrders',
      'deleteOrder',
      'restoreOrder',
      'permanentDeleteOrder',
      'bulkDeleteOrders',
      'bulkRestoreOrders',
      'bulkPermanentDeleteOrders'
    ]),
    ...mapActions('customers', [
      'fetchCustomers',
      'fetchDeletedCustomers',
      'deleteCustomer',
      'restoreCustomer',
      'permanentDeleteCustomer',
      'bulkDeleteCustomers',
      'bulkRestoreCustomers',
      'bulkPermanentDeleteCustomers'
    ]),
    ...mapActions('frames', [
      'fetchDeletedFrames',
      'restoreFrame',
      'permanentDeleteFrame',
      'bulkRestoreFrames',
      'bulkPermanentDeleteFrames'
    ]),
    ...mapActions('designs', [
      'fetchDeletedDesigns',
      'restoreDesign',
      'permanentDeleteDesign',
      'bulkRestoreDesigns',
      'bulkPermanentDeleteDesigns'
    ]),

    showToast(message, type = 'success') {
      this.statusType = type
      this.statusMessage = message
      if (type === 'success') {
        this.$toast?.success(message, 'Studio Console')
      } else if (type === 'error') {
        this.$toast?.error(message, 'Studio Console Error')
      } else {
        this.$toast?.info(message, 'Notice')
      }
      setTimeout(() => {
        if (this.statusMessage === message) {
          this.statusMessage = ''
        }
      }, 5000)
    },

    switchMainTab(tab) {
      this.activeMainTab = tab
      if (tab === 'customers') {
        this.$router.replace({ query: { ...this.$route.query, tab: 'customers' } }).catch(() => {})
        this.fetchCustomers()
      } else if (tab === 'trash') {
        this.$router.replace({ query: { ...this.$route.query, tab: 'trash' } }).catch(() => {})
        this.fetchDeletedOrders()
        this.fetchDeletedCustomers()
        this.fetchDeletedFrames()
        this.fetchDeletedDesigns()
      } else {
        const query = { ...this.$route.query }
        delete query.tab
        this.$router.replace({ query }).catch(() => {})
        this.fetchOrders()
      }
    },

    getStatusCount(status) {
      if (status === 'All') return this.allOrders.length
      return this.allOrders.filter(o => o.status === status).length
    },

    getInitials(name) {
      if (!name) return 'C'
      const parts = name.trim().split(/\s+/)
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    },

    // ----------------------------------------------------
    // Orders Actions
    // ----------------------------------------------------
    async handleDeleteOrder(order) {
      if (confirm(`Move order ${order.id} to Recently Deleted trash?`)) {
        try {
          await this.deleteOrder(order.id)
          this.showToast(`Order ${order.id} moved to Recently Deleted trash.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to delete order', 'error')
        }
      }
    },

    async handleBulkDeleteOrders(ids) {
      try {
        await this.bulkDeleteOrders(ids)
        this.showToast(`Moved ${ids.length} order(s) to Recently Deleted trash.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk delete orders', 'error')
      }
    },

    async handleRestoreOrder(order) {
      try {
        await this.restoreOrder(order.id)
        this.showToast(`Order ${order.id} restored to active orders.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to restore order', 'error')
      }
    },

    async handleBulkRestoreOrders(ids) {
      try {
        await this.bulkRestoreOrders(ids)
        this.showToast(`Restored ${ids.length} order(s) to active orders.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk restore orders', 'error')
      }
    },

    async handlePermanentDeleteOrder(order) {
      if (confirm(`Permanently delete order ${order.id} from database? This cannot be undone.`)) {
        try {
          await this.permanentDeleteOrder(order.id)
          this.showToast(`Order ${order.id} permanently deleted.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete order', 'error')
        }
      }
    },

    async handleBulkPermanentDeleteOrders(ids) {
      try {
        await this.bulkPermanentDeleteOrders(ids)
        this.showToast(`Permanently deleted ${ids.length} order(s).`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk permanently delete orders', 'error')
      }
    },

    // ----------------------------------------------------
    // Customers Actions
    // ----------------------------------------------------
    toggleSelectAllCustomers() {
      if (this.isAllCustomersSelected) {
        this.selectedCustomerIds = []
      } else {
        this.selectedCustomerIds = this.filteredCustomers.map(c => c.id)
      }
    },

    toggleSelectAllDeletedCustomers() {
      if (this.isAllDeletedCustomersSelected) {
        this.selectedDeletedCustomerIds = []
      } else {
        this.selectedDeletedCustomerIds = this.deletedCustomers.map(c => c.id)
      }
    },

    async handleDeleteCustomer(customer) {
      if (confirm(`Move customer "${customer.fullName}" (${customer.email}) to Recently Deleted trash?`)) {
        try {
          await this.deleteCustomer(customer.id)
          this.showToast(`Customer ${customer.fullName} moved to Recently Deleted trash.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to delete customer', 'error')
        }
      }
    },

    async handleBulkDeleteCustomers() {
      if (!this.selectedCustomerIds.length) return
      if (confirm(`Move ${this.selectedCustomerIds.length} customer(s) to Recently Deleted trash?`)) {
        try {
          const count = this.selectedCustomerIds.length
          await this.bulkDeleteCustomers(this.selectedCustomerIds)
          this.selectedCustomerIds = []
          this.showToast(`Moved ${count} customer(s) to Recently Deleted trash.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to bulk delete customers', 'error')
        }
      }
    },

    async handleRestoreCustomer(customer) {
      try {
        await this.restoreCustomer(customer.id)
        this.showToast(`Customer ${customer.fullName} restored to active directory.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to restore customer', 'error')
      }
    },

    async handleBulkRestoreCustomers(ids) {
      try {
        await this.bulkRestoreCustomers(ids)
        this.selectedDeletedCustomerIds = []
        this.showToast(`Restored ${ids.length} customer(s) to active directory.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk restore customers', 'error')
      }
    },

    async handlePermanentDeleteCustomer(customer) {
      if (confirm(`Permanently delete customer "${customer.fullName}"? This cannot be undone.`)) {
        try {
          await this.permanentDeleteCustomer(customer.id)
          this.showToast(`Customer ${customer.fullName} permanently deleted.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete customer', 'error')
        }
      }
    },

    async handleBulkPermanentDeleteCustomers(ids) {
      if (confirm(`Permanently destroy ${ids.length} customer(s) from database? This cannot be undone.`)) {
        try {
          await this.bulkPermanentDeleteCustomers(ids)
          this.selectedDeletedCustomerIds = []
          this.showToast(`Permanently destroyed ${ids.length} customer(s).`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete customers', 'error')
        }
      }
    },

    // ----------------------------------------------------
    // Frames Trash Actions
    // ----------------------------------------------------
    toggleSelectAllDeletedFrames() {
      if (this.isAllDeletedFramesSelected) {
        this.selectedDeletedFrameIds = []
      } else {
        this.selectedDeletedFrameIds = this.deletedFrames.map(f => f.id)
      }
    },

    async handleRestoreFrame(frame) {
      try {
        await this.restoreFrame(frame.id)
        this.selectedDeletedFrameIds = this.selectedDeletedFrameIds.filter(x => x !== frame.id)
        this.showToast(`Frame "${frame.name}" restored to active inventory.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to restore frame', 'error')
      }
    },

    async handleBulkRestoreFrames(ids) {
      try {
        await this.bulkRestoreFrames(ids)
        this.selectedDeletedFrameIds = []
        this.showToast(`Restored ${ids.length} frame(s) to active inventory.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk restore frames', 'error')
      }
    },

    async handlePermanentDeleteFrame(frame) {
      if (confirm(`Permanently delete frame "${frame.name}"? This cannot be undone.`)) {
        try {
          await this.permanentDeleteFrame(frame.id)
          this.selectedDeletedFrameIds = this.selectedDeletedFrameIds.filter(x => x !== frame.id)
          this.showToast(`Frame "${frame.name}" permanently deleted.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete frame', 'error')
        }
      }
    },

    async handleBulkPermanentDeleteFrames(ids) {
      if (confirm(`Permanently destroy ${ids.length} frame(s) from database? This cannot be undone.`)) {
        try {
          await this.bulkPermanentDeleteFrames(ids)
          this.selectedDeletedFrameIds = []
          this.showToast(`Permanently destroyed ${ids.length} frame(s).`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete frames', 'error')
        }
      }
    },

    // ----------------------------------------------------
    // Designs Trash Actions
    // ----------------------------------------------------
    toggleSelectAllDeletedDesigns() {
      if (this.isAllDeletedDesignsSelected) {
        this.selectedDeletedDesignIds = []
      } else {
        this.selectedDeletedDesignIds = this.deletedDesigns.map(d => d.id)
      }
    },

    async handleRestoreDesign(design) {
      try {
        await this.restoreDesign(design.id)
        this.selectedDeletedDesignIds = this.selectedDeletedDesignIds.filter(x => x !== design.id)
        this.showToast(`Design "${design.name}" restored to active catalog.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to restore design', 'error')
      }
    },

    async handleBulkRestoreDesigns(ids) {
      try {
        await this.bulkRestoreDesigns(ids)
        this.selectedDeletedDesignIds = []
        this.showToast(`Restored ${ids.length} design template(s) to active catalog.`)
      } catch (err) {
        this.showToast(err.message || 'Failed to bulk restore designs', 'error')
      }
    },

    async handlePermanentDeleteDesign(design) {
      if (confirm(`Permanently delete design "${design.name}"? This cannot be undone.`)) {
        try {
          await this.permanentDeleteDesign(design.id)
          this.selectedDeletedDesignIds = this.selectedDeletedDesignIds.filter(x => x !== design.id)
          this.showToast(`Design "${design.name}" permanently deleted.`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete design', 'error')
        }
      }
    },

    async handleBulkPermanentDeleteDesigns(ids) {
      if (confirm(`Permanently destroy ${ids.length} design template(s) from database? This cannot be undone.`)) {
        try {
          await this.bulkPermanentDeleteDesigns(ids)
          this.selectedDeletedDesignIds = []
          this.showToast(`Permanently destroyed ${ids.length} design template(s).`)
        } catch (err) {
          this.showToast(err.message || 'Failed to permanently delete designs', 'error')
        }
      }
    },

    async handleEmptyCurrentTrash() {
      if (this.activeTrashSubTab === 'orders') {
        if (!this.deletedOrders.length) return
        if (confirm(`Empty Trash: Permanently delete all ${this.deletedOrders.length} deleted order(s)? This CANNOT be undone.`)) {
          const ids = this.deletedOrders.map(o => o.id)
          await this.handleBulkPermanentDeleteOrders(ids)
        }
      } else if (this.activeTrashSubTab === 'customers') {
        if (!this.deletedCustomers.length) return
        if (confirm(`Empty Trash: Permanently delete all ${this.deletedCustomers.length} deleted customer(s)? This CANNOT be undone.`)) {
          const ids = this.deletedCustomers.map(c => c.id)
          await this.handleBulkPermanentDeleteCustomers(ids)
        }
      } else if (this.activeTrashSubTab === 'frames') {
        if (!this.deletedFrames.length) return
        if (confirm(`Empty Trash: Permanently delete all ${this.deletedFrames.length} deleted frame(s)? This CANNOT be undone.`)) {
          const ids = this.deletedFrames.map(f => f.id)
          await this.handleBulkPermanentDeleteFrames(ids)
        }
      } else if (this.activeTrashSubTab === 'designs') {
        if (!this.deletedDesigns.length) return
        if (confirm(`Empty Trash: Permanently delete all ${this.deletedDesigns.length} deleted design(s)? This CANNOT be undone.`)) {
          const ids = this.deletedDesigns.map(d => d.id)
          await this.handleBulkPermanentDeleteDesigns(ids)
        }
      }
    },

    // ----------------------------------------------------
    // Email Modal & Navigation
    // ----------------------------------------------------
    openComposeModal(target, customer = null) {
      this.composeTarget = target
      this.selectedCustomer = customer
      this.composeModalOpen = true
    },

    filterOrdersByCustomer(customer) {
      this.switchMainTab('orders')
      this.searchQuery = customer.email || customer.fullName
    },

    onEmailSent(result) {
      console.log('✅ [ADMIN:CUSTOMER:EMAIL] Dispatched successfully:', result)
      this.showToast('Customer offer/broadcast email sent successfully!')
    }
  }
}
</script>
