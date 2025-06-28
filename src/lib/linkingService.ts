import { ProductivityItem } from '../types';
import { DatabaseService } from './supabase';

export class LinkingService {
  // Detect potential relationships between items
  static detectRelationships(newItem: ProductivityItem, existingItems: ProductivityItem[]): string[] {
    const relationships: string[] = [];
    
    // Enhanced keywords that suggest relationships
    const relationshipKeywords = [
      // Meeting-related
      'meeting', 'call', 'discussion', 'conference', 'standup', 'sync', 'catchup',
      'interview', 'presentation', 'demo', 'review', 'retrospective',

      // Task-related
      'follow up', 'followup', 'action item', 'todo', 'task', 'complete',
      'prepare', 'preparation', 'setup', 'organize', 'plan', 'research',

      // Note-related
      'notes', 'agenda', 'minutes', 'summary', 'recap', 'document',
      'brainstorm', 'ideas', 'thoughts', 'feedback', 'insights',

      // Project-related
      'project', 'deadline', 'due', 'schedule', 'milestone', 'deliverable',
      'launch', 'release', 'deployment', 'implementation'
    ];
    
    const newItemText = this.getSearchableText(newItem).toLowerCase();
    
    for (const existingItem of existingItems) {
      const existingItemText = this.getSearchableText(existingItem).toLowerCase();
      
      // Check for common keywords
      const commonKeywords = this.findCommonKeywords(newItemText, existingItemText, relationshipKeywords);
      
      // Check for date proximity (within 7 days)
      const dateProximity = this.checkDateProximity(newItem, existingItem);
      
      // Check for people/attendee overlap
      const peopleOverlap = this.checkPeopleOverlap(newItem, existingItem);
      
      // Check for explicit mentions
      const explicitMention = this.checkExplicitMention(newItem, existingItem);

      // Check for cross-type relationships
      const crossTypeRelation = this.detectCrossTypeRelationship(newItem, existingItem);

      // Score the relationship
      let score = 0;
      if (commonKeywords.length > 0) score += commonKeywords.length * 10;
      if (dateProximity) score += 20;
      if (peopleOverlap) score += 30;
      if (explicitMention) score += 50;
      if (crossTypeRelation) score += 40;
      
      // If score is high enough, suggest a relationship
      if (score >= 30) {
        relationships.push(existingItem.id);
      }
    }
    
    return relationships;
  }
  
  private static getSearchableText(item: ProductivityItem): string {
    return [
      item.title,
      item.description,
      item.content,
      item.location,
      ...(item.tags || []),
      ...(item.attendees || [])
    ].filter(Boolean).join(' ');
  }
  
  private static findCommonKeywords(text1: string, text2: string, keywords: string[]): string[] {
    const common: string[] = [];
    
    for (const keyword of keywords) {
      if (text1.includes(keyword) && text2.includes(keyword)) {
        common.push(keyword);
      }
    }
    
    return common;
  }
  
  private static checkDateProximity(item1: ProductivityItem, item2: ProductivityItem): boolean {
    const getItemDate = (item: ProductivityItem): Date | null => {
      if (item.start_time) return new Date(item.start_time);
      if (item.due_date) return new Date(item.due_date);
      if (item.created_at) return new Date(item.created_at);
      return null;
    };
    
    const date1 = getItemDate(item1);
    const date2 = getItemDate(item2);
    
    if (!date1 || !date2) return false;
    
    const diffMs = Math.abs(date1.getTime() - date2.getTime());
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    return diffDays <= 7;
  }
  
  private static checkPeopleOverlap(item1: ProductivityItem, item2: ProductivityItem): boolean {
    const people1 = item1.attendees || [];
    const people2 = item2.attendees || [];
    
    if (people1.length === 0 || people2.length === 0) return false;
    
    return people1.some(person => people2.includes(person));
  }
  
  private static checkExplicitMention(item1: ProductivityItem, item2: ProductivityItem): boolean {
    const text1 = this.getSearchableText(item1).toLowerCase();
    const text2 = this.getSearchableText(item2).toLowerCase();
    
    // Check if one item mentions the other by title
    const title1Words = item1.title.toLowerCase().split(' ').filter(word => word.length > 3);
    const title2Words = item2.title.toLowerCase().split(' ').filter(word => word.length > 3);
    
    const item1MentionsItem2 = title2Words.some(word => text1.includes(word));
    const item2MentionsItem1 = title1Words.some(word => text2.includes(word));
    
    return item1MentionsItem2 || item2MentionsItem1;
  }
  
  // Create a link between two items
  static async createLink(fromItemId: string, toItemId: string): Promise<boolean> {
    try {
      // Add to linked_items array in both items
      const { data: fromItem } = await DatabaseService.getItemById(fromItemId);
      const { data: toItem } = await DatabaseService.getItemById(toItemId);
      
      if (!fromItem || !toItem) return false;
      
      // Update from item
      const fromLinkedItems = fromItem.linked_items || [];
      if (!fromLinkedItems.includes(toItemId)) {
        fromLinkedItems.push(toItemId);
        await DatabaseService.updateItem(fromItemId, { linked_items: fromLinkedItems });
      }
      
      // Update to item
      const toLinkedItems = toItem.linked_items || [];
      if (!toLinkedItems.includes(fromItemId)) {
        toLinkedItems.push(fromItemId);
        await DatabaseService.updateItem(toItemId, { linked_items: toLinkedItems });
      }
      
      return true;
    } catch (error) {
      console.error('Error creating link:', error);
      return false;
    }
  }
  
  // Remove a link between two items
  static async removeLink(fromItemId: string, toItemId: string): Promise<boolean> {
    try {
      // Remove from linked_items array in both items
      const { data: fromItem } = await DatabaseService.getItemById(fromItemId);
      const { data: toItem } = await DatabaseService.getItemById(toItemId);
      
      if (!fromItem || !toItem) return false;
      
      // Update from item
      const fromLinkedItems = (fromItem.linked_items || []).filter(id => id !== toItemId);
      await DatabaseService.updateItem(fromItemId, { linked_items: fromLinkedItems });
      
      // Update to item
      const toLinkedItems = (toItem.linked_items || []).filter(id => id !== fromItemId);
      await DatabaseService.updateItem(toItemId, { linked_items: toLinkedItems });
      
      return true;
    } catch (error) {
      console.error('Error removing link:', error);
      return false;
    }
  }
  
  // Get all linked items for a given item
  static async getLinkedItems(itemId: string): Promise<ProductivityItem[]> {
    try {
      const { data: item } = await DatabaseService.getItemById(itemId);
      if (!item || !item.linked_items || item.linked_items.length === 0) {
        return [];
      }
      
      const linkedItems: ProductivityItem[] = [];
      
      for (const linkedId of item.linked_items) {
        const { data: linkedItem } = await DatabaseService.getItemById(linkedId);
        if (linkedItem) {
          linkedItems.push(linkedItem);
        }
      }
      
      return linkedItems;
    } catch (error) {
      console.error('Error getting linked items:', error);
      return [];
    }
  }
  
  // Suggest links for an item based on AI analysis
  static async suggestLinksWithAI(item: ProductivityItem, existingItems: ProductivityItem[]): Promise<string[]> {
    // This would use Gemini AI to analyze content and suggest relationships
    // For now, use the rule-based detection
    return this.detectRelationships(item, existingItems);
  }
  
  // Auto-link items when creating from voice commands
  static async autoLinkVoiceItems(items: Partial<ProductivityItem>[]): Promise<void> {
    // When multiple items are created from a single voice command,
    // automatically link them together
    if (items.length < 2) return;
    
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const item1 = items[i];
        const item2 = items[j];
        
        if (item1.id && item2.id) {
          await this.createLink(item1.id, item2.id);
        }
      }
    }
  }

  // Enhanced cross-type relationship detection
  private static detectCrossTypeRelationship(item1: ProductivityItem, item2: ProductivityItem): boolean {
    const text1 = this.getSearchableText(item1).toLowerCase();
    const text2 = this.getSearchableText(item2).toLowerCase();

    // Meeting → Task relationships
    if (item1.type === 'calendar' && item2.type === 'task') {
      const meetingToTaskKeywords = ['prepare', 'preparation', 'agenda', 'action item', 'follow up', 'todo'];
      return meetingToTaskKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    // Task → Meeting relationships
    if (item1.type === 'task' && item2.type === 'calendar') {
      const taskToMeetingKeywords = ['discuss', 'meeting', 'present', 'review', 'demo'];
      return taskToMeetingKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    // Meeting → Note relationships
    if (item1.type === 'calendar' && item2.type === 'note') {
      const meetingToNoteKeywords = ['notes', 'minutes', 'agenda', 'summary', 'recap'];
      return meetingToNoteKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    // Note → Meeting relationships
    if (item1.type === 'note' && item2.type === 'calendar') {
      const noteToMeetingKeywords = ['meeting', 'discussion', 'call', 'agenda'];
      return noteToMeetingKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    // Task → Note relationships
    if (item1.type === 'task' && item2.type === 'note') {
      const taskToNoteKeywords = ['research', 'notes', 'documentation', 'plan', 'ideas'];
      return taskToNoteKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    // Note → Task relationships
    if (item1.type === 'note' && item2.type === 'task') {
      const noteToTaskKeywords = ['todo', 'action', 'implement', 'complete', 'task'];
      return noteToTaskKeywords.some(keyword =>
        text1.includes(keyword) || text2.includes(keyword)
      );
    }

    return false;
  }
}
