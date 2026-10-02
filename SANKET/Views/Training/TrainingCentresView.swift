import SwiftUI
import MapKit

struct TrainingCentresView: View {
    @Environment(AppState.self) private var appState
    @State private var selectedId: String = "okhla"
    @State private var showConfirm = false

    var body: some View {
        List {
            Section {
                ForEach(MockData.centres) { centre in
                    Button {
                        selectedId = centre.id
                        appState.selectedCentreId = centre.id
                    } label: {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(centre.name)
                                    .font(.headline)
                                    .foregroundStyle(.primary)
                                Text("\(centre.programTitle) · \(centre.distanceKm) km")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: selectedId == centre.id ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(selectedId == centre.id ? SANKETTheme.accent : .secondary)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }

            if let centre = MockData.centres.first(where: { $0.id == selectedId }) {
                Section(String(localized: "centre_details")) {
                    detail("Program", centre.programTitle)
                    detail(String(localized: "detail_training"), "\(centre.weeks) \(String(localized: "weeks_unit"))")
                    detail(String(localized: "seats_available"), "\(centre.seatsAvailable)")
                    detail(String(localized: "next_batch"), centre.nextBatch)
                    Label(
                        centre.equipmentAvailable ? String(localized: "equipment_yes") : String(localized: "equipment_no"),
                        systemImage: centre.equipmentAvailable ? "wrench.and.screwdriver.fill" : "wrench.and.screwdriver"
                    )
                    Label(
                        centre.placementLinkage ? String(localized: "placement_yes") : String(localized: "placement_no"),
                        systemImage: "briefcase.fill"
                    )

                    SeatsIndicator(available: centre.seatsAvailable, capacity: 30)

                    Map(initialPosition: .region(MKCoordinateRegion(
                        center: centre.coordinate,
                        span: MKCoordinateSpan(latitudeDelta: 0.05, longitudeDelta: 0.05)
                    ))) {
                        Marker(centre.name, coordinate: centre.coordinate)
                    }
                    .frame(height: 160)
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                }

                Section {
                    PrimaryButton(title: String(localized: "cta_enrol")) {
                        showConfirm = true
                    }
                    .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                    .listRowBackground(Color.clear)
                }
            }
        }
        .navigationTitle(String(localized: "centres_title"))
        .navigationBarTitleDisplayMode(.inline)
        .confirmationDialog(String(localized: "enrol_confirm_title"), isPresented: $showConfirm, titleVisibility: .visible) {
            Button(String(localized: "cta_confirm_enrol")) {
                appState.enrolInTraining(centreId: selectedId, courseId: "c-battery")
            }
            Button(String(localized: "cta_cancel"), role: .cancel) {}
        } message: {
            Text(String(localized: "enrol_confirm_body"))
        }
        .onAppear {
            selectedId = appState.selectedCentreId
        }
    }

    private func detail(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(value).foregroundStyle(.secondary)
        }
    }
}

struct SeatsIndicator: View {
    let available: Int
    let capacity: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(String(localized: "seats_available_label \(available)"))
                .font(.subheadline)
            ProgressView(value: Double(available), total: Double(capacity))
                .tint(SANKETTheme.accent)
        }
        .padding(.vertical, 4)
    }
}
