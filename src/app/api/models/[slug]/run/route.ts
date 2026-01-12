import { NextResponse } from 'next/server'
import { auth, getUserTier } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Calculator functions for each model
function calculatePayoutCurveSanity(inputs: any) {
  const { quota, ote, baseSalary, acceleratorThreshold, acceleratorRate, cap } = inputs
  const commissionAtTarget = ote - baseSalary

  const results: any = {}
  const attainmentLevels = [50, 75, 100, 125, 150, 175, 200]

  attainmentLevels.forEach(attainment => {
    const revenue = quota * (attainment / 100)
    let payout = baseSalary

    if (attainment <= acceleratorThreshold) {
      // Below threshold: linear
      payout += commissionAtTarget * (attainment / 100)
    } else {
      // At/above threshold: accelerated
      payout += commissionAtTarget * (acceleratorThreshold / 100)
      const excessAttainment = attainment - acceleratorThreshold
      const excessRevenue = quota * (excessAttainment / 100)
      const excessCommission = commissionAtTarget * (excessRevenue / quota)
      payout += excessCommission * (acceleratorRate / 100)
    }

    // Apply cap if set
    if (cap > 0 && attainment > cap) {
      const capRevenue = quota * (cap / 100)
      let capPayout = baseSalary
      if (cap <= acceleratorThreshold) {
        capPayout += commissionAtTarget * (cap / 100)
      } else {
        capPayout += commissionAtTarget * (acceleratorThreshold / 100)
        const capExcess = cap - acceleratorThreshold
        capPayout += commissionAtTarget * (capExcess / 100) * (acceleratorRate / 100)
      }
      payout = capPayout
    }

    results[`payout${attainment}Percent`] = Math.round(payout)
    results[`costRatio${attainment}Percent`] = ((payout / revenue) * 100).toFixed(1)
  })

  return results
}

function calculateAcceleratorImpact(inputs: any) {
  const { quota, ote, currentThreshold, currentRate, newThreshold, newRate, teamSize, avgAttainment } = inputs
  const baseSalary = ote * 0.4
  const commissionAtTarget = ote - baseSalary

  const calcPayout = (attainment: number, threshold: number, rate: number) => {
    let payout = baseSalary
    if (attainment <= threshold) {
      payout += commissionAtTarget * (attainment / 100)
    } else {
      payout += commissionAtTarget * (threshold / 100)
      const excess = attainment - threshold
      payout += commissionAtTarget * (excess / 100) * (rate / 100)
    }
    return payout
  }

  const currentPayout = calcPayout(avgAttainment, currentThreshold, currentRate)
  const newPayout = calcPayout(avgAttainment, newThreshold, newRate)

  return {
    currentPayoutPerRep: Math.round(currentPayout),
    newPayoutPerRep: Math.round(newPayout),
    deltaPerRep: Math.round(newPayout - currentPayout),
    currentTotalCost: Math.round(currentPayout * teamSize),
    newTotalCost: Math.round(newPayout * teamSize),
    totalDelta: Math.round((newPayout - currentPayout) * teamSize),
    percentChange: (((newPayout - currentPayout) / currentPayout) * 100).toFixed(1),
  }
}

function calculateQuotaRelief(inputs: any) {
  const { originalQuota, quarterProgress, accountsLost, accountsGained, currentAttainment, reliefMethod } = inputs

  const timeRemaining = 1 - (quarterProgress / 100)
  const netAccountChange = accountsGained - accountsLost

  let relievedQuota = originalQuota

  if (reliefMethod === 'PROPORTIONAL') {
    relievedQuota = originalQuota + netAccountChange
  } else if (reliefMethod === 'TIME_BASED') {
    relievedQuota = originalQuota + (netAccountChange * timeRemaining)
  } else if (reliefMethod === 'PIPELINE_WEIGHTED') {
    const performanceRatio = currentAttainment / (originalQuota * (quarterProgress / 100))
    relievedQuota = originalQuota + (netAccountChange * timeRemaining * performanceRatio)
  }

  const relief = relievedQuota - originalQuota
  const newAttainmentPercent = (currentAttainment / relievedQuota) * 100

  return {
    originalQuota: Math.round(originalQuota),
    relievedQuota: Math.round(relievedQuota),
    quotaRelief: Math.round(relief),
    reliefPercent: ((relief / originalQuota) * 100).toFixed(1),
    newAttainmentPercent: newAttainmentPercent.toFixed(1),
    accountsLost: Math.round(accountsLost),
    accountsGained: Math.round(accountsGained),
    netChange: Math.round(netAccountChange),
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check user tier
    const userTier = await getUserTier(userId)

    if (userTier !== 'PRO' && userTier !== 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'Working Models require SPARCC subscription' },
        { status: 403 }
      )
    }

    const { slug } = await params
    const { inputs } = await request.json()

    const model = await prisma.workingModel.findUnique({
      where: { slug },
    })

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Run calculation based on model slug
    let outputs
    switch (model.slug) {
      case 'payout-curve-sanity-check':
        outputs = calculatePayoutCurveSanity(inputs)
        break
      case 'accelerator-threshold-impact':
        outputs = calculateAcceleratorImpact(inputs)
        break
      case 'quota-relief-calculator':
        outputs = calculateQuotaRelief(inputs)
        break
      default:
        return NextResponse.json(
          { error: 'Unknown model' },
          { status: 400 }
        )
    }

    // Save run to history
    const modelRun = await prisma.modelRun.create({
      data: {
        userId,
        modelId: model.id,
        inputs,
        outputs,
      },
    })

    return NextResponse.json({ outputs, runId: modelRun.id })
  } catch (error) {
    console.error('Error running model:', error)
    return NextResponse.json(
      { error: 'Failed to run model' },
      { status: 500 }
    )
  }
}
