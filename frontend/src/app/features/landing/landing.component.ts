import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface CoverageFeature {
  icon: string;
  title: string;
  description: string;
  tags: string[];
}

interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  private readonly authService = inject(AuthService);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userRole(): string {
    return this.authService.getUserRole() || '';
  }

  // Interactive Calculator State
  selectedCalculatorTab: 'equipment' | 'income' = 'equipment';
  equipmentValue: number = 250000;
  monthlyIncome: number = 75000;
  benefitMonths: number = 3;

  get estimatedEquipmentPremium(): number {
    return Math.round(this.equipmentValue * 0.00035 * 14 * 100) / 100;
  }

  get estimatedIncomePremium(): number {
    return Math.round(this.monthlyIncome * 0.05 * 12 * 100) / 100;
  }

  // Feature Highlights
  equipmentFeatures: CoverageFeature[] = [
    {
      icon: 'videocam',
      title: 'Cinematography & Camera Gear',
      description: 'Full-frame cameras, cine lenses, RED/ARRI gear, lighting kits, and high-speed memory modules.',
      tags: ['Accidental Damage', 'Theft Protection', 'Transit Cover']
    },
    {
      icon: 'flight_takeoff',
      title: 'Drones & Aerial Systems',
      description: 'Commercial UAVs, gimbals, controllers, and dual-operator field stations during active shoot days.',
      tags: ['Flyaway Buffer', 'Water Ingress', 'Rapid Replacements']
    },
    {
      icon: 'laptop_mac',
      title: 'High-End Workstations & Laptops',
      description: 'Custom editing rigs, MacBook Pros, audio interfaces, and digital storage units in client premises.',
      tags: ['Hardware Failure', 'On-Site Custody', 'Worldwide Zero Deductible']
    }
  ];

  incomeFeatures: CoverageFeature[] = [
    {
      icon: 'receipt_long',
      title: 'Client Default & Non-Payment',
      description: 'Guarantees payout when clients declare insolvency, default on milestones, or file liquidation.',
      tags: ['Direct Cash Recovery', 'Milestone Protection']
    },
    {
      icon: 'gavel',
      title: 'Unlawful Contract Breach',
      description: 'Protection when a client terminates mid-project without notice or repudiates scope deliverables.',
      tags: ['Legal Dispute Shield', 'Interim Stipend']
    },
    {
      icon: 'healing',
      title: 'Emergency Incapacity',
      description: 'Medical or unforeseen emergency coverage ensuring up to 6 months of ongoing baseline income.',
      tags: ['Zero Income Drop', '30-Day Fast Turnaround']
    }
  ];

  workflowSteps: WorkflowStep[] = [
    {
      step: '01',
      title: 'Link Your Project & Gear',
      description: 'Create a freelance project, attach client details, and catalog serial numbers for client-provided equipment.',
      icon: 'assignment',
      badge: 'Freelancer'
    },
    {
      step: '02',
      title: 'Instant AI Risk Assessment',
      description: 'Our proprietary Risk Engine scans project duration, gear classification, and terms to build an actuarial quote.',
      icon: 'psychology',
      badge: 'Automated'
    },
    {
      step: '03',
      title: 'Underwriter Policy Issuance',
      description: 'Certified underwriters review quote specifics, assess exposure, and issue binding digital policy contracts.',
      icon: 'verified_user',
      badge: 'Underwriter'
    },
    {
      step: '04',
      title: 'Rapid Claims & Settlements',
      description: 'Submit incident evidence in seconds. Claims assessors evaluate digital chain of custody for expedited bank payouts.',
      icon: 'payments',
      badge: 'Assessor'
    }
  ];

  faqs = [
    {
      question: 'What is Client Equipment Custody coverage?',
      answer: 'When clients entrust you with expensive equipment (like cameras, drones, or specialized laptops) for a project, you become legally responsible for them. FreelanceShield covers accidental damage, drops, water incidents, and theft during the project timeline so you never face out-of-pocket liabilities.'
    },
    {
      question: 'How quickly does the Underwriter review policy applications?',
      answer: 'Our Risk Underwriting Service automatically scores applications within seconds. Certified underwriters review the generated quote and issue policies typically within 15 minutes to a few hours.'
    },
    {
      question: 'Can I apply for coverage directly from my project list?',
      answer: 'Yes! Simply navigate to "My Projects", click the "Apply for Policy" action button next to your project, and your request will instantly be submitted to the Underwriter queue with all equipment pre-loaded.'
    },
    {
      question: 'How does Income Assurance work if a client fails to pay?',
      answer: 'If a client cancels a contract unlawfully or defaults due to insolvency, FreelanceShield pays out your selected monthly benefit for up to 12 months after verification of your contract agreement.'
    },
    {
      question: 'How do I file a claim if equipment is damaged on a gig?',
      answer: 'Go to the Claims portal, select your active equipment policy, enter incident details with photos/documentation, and submit. An assessor will verify the chain of custody and authorize settlement.'
    }
  ];

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
